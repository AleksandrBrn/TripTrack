import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSelectedRoute } from '../hooks/hooks';

export function MapViewer() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geojson = useSelectedRoute();

  useEffect(() => {
    // 1. Инициализация карты
    if (!mapInstanceRef.current) {
      const map = new maplibregl.Map({
        container: mapRef.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
        center: [60.597474, 56.838011], // центр Екатеринбурга
        zoom: 5,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded() || !geojson) return;
  
    const coords = geojson.coordinates;
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
      properties: {},
    };
  
    if (map.getLayer('route-line')) {
      map.removeLayer('route-line');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }
  
    map.addSource('route', {
      type: 'geojson',
      data: feature,
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
  
    let i = 0;
    function animateLine() {
      if (i < coords.length) {
        feature.geometry.coordinates.push(coords[i]);
        map.getSource('route').setData(feature);
        i++;
        requestAnimationFrame(animateLine);
      }
    }
  
    animateLine();
  
    // Автофокус
    const bounds = coords.reduce(
      (b, [lng, lat]) => b.extend([lng, lat]),
      new maplibregl.LngLatBounds()
    );
    map.fitBounds(bounds, { padding: 40 });
  
  }, [geojson]);  

  if (!isOpen) return <></>;
  return <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: 8 }} />;
}
