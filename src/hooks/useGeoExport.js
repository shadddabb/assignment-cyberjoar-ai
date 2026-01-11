import { useContext } from 'react';
import { useMap } from '../context/MapContext';

/**
 * Custom hook for exporting shapes to GeoJSON
 */
export function useGeoExport() {
  const { state } = useMap();

  /**
   * Exports all shapes to GeoJSON format and downloads as file
   */
  const exportToGeoJSON = () => {
    if (state.shapes.length === 0) {
      alert('No shapes to export');
      return;
    }

    // Create GeoJSON FeatureCollection
    const geoJSON = {
      type: 'FeatureCollection',
      features: state.shapes.map(shape => ({
        type: 'Feature',
        geometry: shape.geometry,
        properties: {
          type: shape.type,
          id: shape.id,
          createdAt: shape.properties.createdAt
        }
      }))
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(geoJSON, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `map-shapes-${new Date().toISOString().split('T')[0]}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  /**
   * Gets GeoJSON as string (for preview or other uses)
   * @returns {string} - GeoJSON string
   */
  const getGeoJSONString = () => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: state.shapes.map(shape => ({
        type: 'Feature',
        geometry: shape.geometry,
        properties: {
          type: shape.type,
          id: shape.id,
          createdAt: shape.properties.createdAt
        }
      }))
    };
    
    return JSON.stringify(geoJSON, null, 2);
  };

  return {
    exportToGeoJSON,
    getGeoJSONString,
    shapeCount: state.shapes.length
  };
}