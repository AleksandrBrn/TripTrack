// import { useEffect, useRef, useState } from 'react';
// import { Dialog, DialogContent, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import { useSelectedRoute, useOpen, useSetOpen } from './hooks/hooks';

// export function MapViewer() {
//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);
//   const geojson = useSelectedRoute();
//   const isOpen = useOpen();
//   const setOpen = useSetOpen();
//   const [mapInitialized, setMapInitialized] = useState(false);

//   const initializeMap = () => {
//     if (!mapContainerRef.current || mapRef.current) return;

//     const map = new maplibregl.Map({
//       container: mapContainerRef.current,
//       style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
//       center: [60.597474, 56.838011],
//       zoom: 5,
//     });

//     map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

//     map.on('load', () => {
//       console.log('[Map] loaded');

//       if (geojson?.coordinates?.length) {
//         map.addSource('route', {
//           type: 'geojson',
//           data: {
//             type: 'Feature',
//             geometry: {
//               type: 'LineString',
//               coordinates: geojson.coordinates,
//             },
//           },
//         });

//         map.addLayer({
//           id: 'route-line',
//           type: 'line',
//           source: 'route',
//           layout: {
//             'line-cap': 'round',
//             'line-join': 'round',
//           },
//           paint: {
//             'line-color': '#007AFF',
//             'line-width': 4,
//           },
//         });

//         // Fit bounds
//         const bounds = geojson.coordinates.reduce(
//           (b, [lng, lat]) => b.extend([lng, lat]),
//           new maplibregl.LngLatBounds()
//         );
//         map.fitBounds(bounds, { padding: 40 });
//       }
//     });

//     mapRef.current = map;
//     setMapInitialized(true);
//   };

//   useEffect(() => {
//     if (!isOpen && mapRef.current) {
//       mapRef.current.remove();
//       mapRef.current = null;
//       setMapInitialized(false);
//     }
//   }, [isOpen]);

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={() => setOpen(false)}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{
//         sx: {
//           height: '90vh',
//           borderRadius: 2,
//           position: 'relative',
//           overflow: 'hidden',
//         }
//       }}
//       TransitionProps={{
//         onEntered: () => {
//           console.log('[Dialog] fully opened');
//           initializeMap();
//         }
//       }}
//     >
//       <IconButton
//         onClick={() => setOpen(false)}
//         sx={{
//           position: 'absolute',
//           right: 8,
//           top: 8,
//           zIndex: 10,
//           backgroundColor: 'rgba(255,255,255,0.7)',
//           '&:hover': {
//             backgroundColor: 'rgba(255,255,255,0.9)',
//           },
//         }}
//       >
//         <CloseIcon />
//       </IconButton>

//       <DialogContent
//         sx={{
//           p: 0,
//           height: '100%',
//           position: 'relative',
//         }}
//       >
//         <div
//           ref={mapContainerRef}
//           style={{
//             position: 'absolute',
//             inset: 0,
//             visibility: mapInitialized ? 'visible' : 'hidden',
//           }}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSelectedRoute, useOpen, useSetOpen } from './hooks/hooks';

export function MapViewer() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geojson = useSelectedRoute();
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
              'line-width': 4,
            },
          });
        }

        // Добавляем источник для точек start и end
        const startPoint = geojson.coordinates[0];
        const endPoint = geojson.coordinates[geojson.coordinates.length - 1];

        const pointsFeatureCollection = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { pointType: 'start' },
              geometry: {
                type: 'Point',
                coordinates: startPoint,
              },
            },
            {
              type: 'Feature',
              properties: { pointType: 'end' },
              geometry: {
                type: 'Point',
                coordinates: endPoint,
              },
            },
          ],
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
            filter: ['==', ['get', 'pointType'], 'start'],
            paint: {
              'circle-radius': 8,
              'circle-color': '#007AFF',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            },
          });

          // Слой для конечной точки — красный кружок
          map.addLayer({
            id: 'end-point',
            type: 'circle',
            source: 'route-points',
            filter: ['==', ['get', 'pointType'], 'end'],
            paint: {
              'circle-radius': 8,
              'circle-color': '#FF3B30',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
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
