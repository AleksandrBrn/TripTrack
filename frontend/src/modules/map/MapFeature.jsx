import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSelectedGeojson, useSelectedPoints, useOpen, useSetOpen } from './hooks/hooks';

export function MapViewer() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geojson = useSelectedGeojson();
  const points = useSelectedPoints();
  const isOpen = useOpen();
  const setOpen = useSetOpen();
  const [mapInitialized, setMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
      center: [60.597474, 56.838011],
      zoom: 5,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.on('load', () => {
      console.log(points);
      if (geojson?.coordinates?.length) {
        // Добавляем или обновляем источник маршрута
        if (map.getSource('route')) {
          map.getSource('route').setData({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: geojson.coordinates,
            },
          });
        } else {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: geojson.coordinates,
              },
            },
          });

          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#007AFF',
              'line-width': 3,
            },
          });
        }

        const pointsFeatureCollection = {
          type: 'FeatureCollection',
          features: points.map((point, index) => ({
                  type: 'Feature',
                  properties: { pointType: 'point', order: index + 1 },
                  geometry: {
                    type: 'Point',
                    //1 координата - долгота, 2 - широта
                    coordinates: [point.long, point.lat],
                  }, 
                })),
        };

        if (map.getSource('route-points')) {
          map.getSource('route-points').setData(pointsFeatureCollection);
        } else {
          map.addSource('route-points', {
            type: 'geojson',
            data: pointsFeatureCollection,
          });

          // Слой для стартовой точки — синий кружок
          map.addLayer({
            id: 'start-point',
            type: 'circle',
            source: 'route-points',
            filter: ['==', ['get', 'pointType'], 'point'],
            paint: {
              'circle-radius': 8,
              'circle-color': '#007AFF',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            },
          });

          map.addLayer({
            id: 'route-points-labels',
            type: 'symbol',
            source: {
              type: 'geojson',
              data: pointsFeatureCollection,
            },
            layout: {
              'text-field': ['get', 'order'],
              'text-size': 10,
              'text-anchor': 'center',
              'text-offset': [0, 0],
            },
            paint: {
              'text-color': '#fff',
              'text-halo-color': '#007AFF',
              'text-halo-width': 1,
            },
          });
        }

        const bounds = geojson.coordinates.reduce(
          (b, [lng, lat]) => b.extend([lng, lat]),
          new maplibregl.LngLatBounds()
        );
        map.fitBounds(bounds, { padding: 40 });
      }
    });

    mapRef.current = map;
    setMapInitialized(true);
  };

  useEffect(() => {
    if (!isOpen && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      setMapInitialized(false);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        },
      }}
      TransitionProps={{
        onEntered: () => {
          initializeMap();
        },
      }}
    >
      <IconButton
        onClick={() => setOpen(false)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          p: 0,
          height: '100%',
          position: 'relative',
        }}
      >
        <div
          ref={mapContainerRef}
          style={{
            position: 'absolute',
            inset: 0,
            visibility: mapInitialized ? 'visible' : 'hidden',
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
