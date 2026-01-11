import { useState, useCallback } from 'react';
import { useMap } from '../context/MapContext';
import { checkPolygonOverlap, checkPolygonEnclosure, trimPolygonOverlaps, leafletLayerToGeoJSON } from '../utils/geoUtils';
import { SHAPE_LIMITS } from '../config/constants';

/**
 * Custom hook for managing drawing operations and constraints
 */
export function useDrawing() {
  const { state, actions } = useMap();
  const [currentLayer, setCurrentLayer] = useState(null);

  /**
   * Handles the creation of a new drawn shape
   * @param {Object} layer - The drawn Leaflet layer
   * @param {string} type - Type of shape (circle, rectangle, polygon, linestring)
   */
  const handleShapeCreated = useCallback((layer, type) => {
    try {
      // Convert layer to GeoJSON
      const geoJSON = leafletLayerToGeoJSON(layer, type);
      
      // For polygonal features, check overlap constraints
      if (['circle', 'rectangle', 'polygon'].includes(type)) {
        const existingPolygons = state.shapes
          .filter(shape => ['circle', 'rectangle', 'polygon'].includes(shape.type))
          .map(shape => ({
            type: 'Feature',
            geometry: shape.geometry,
            properties: shape.properties
          }));
        
        // Check if new polygon is fully enclosed by any existing polygon
        for (const existingPolygon of existingPolygons) {
          if (checkPolygonEnclosure(existingPolygon, geoJSON)) {
            actions.setError(`Cannot create ${type}: it would be fully enclosed by an existing shape`);
            return false;
          }
        }
        
        // Trim overlaps if any exist
        const trimmedGeoJSON = trimPolygonOverlaps(geoJSON, existingPolygons);
        
        if (!trimmedGeoJSON) {
          actions.setError(`Cannot create ${type}: it would be fully enclosed by existing shapes`);
          return false;
        }
        
        // Update the geoJSON with trimmed geometry
        geoJSON.geometry = trimmedGeoJSON.geometry;
      }
      
      // Add the shape to state
      const success = actions.addShape({
        id: geoJSON.properties.id,
        type: type,
        geometry: geoJSON.geometry,
        properties: geoJSON.properties,
        layer: layer
      });
      
      if (success) {
        actions.clearErrors();
      }
      
      return success;
    } catch (error) {
      console.error('Error creating shape:', error);
      actions.setError(`Failed to create ${type}: ${error.message}`);
      return false;
    }
  }, [state.shapes, actions]);

  /**
   * Handles the deletion of a shape
   * @param {string} shapeId - ID of the shape to delete
   */
  const handleShapeDeleted = useCallback((shapeId) => {
    actions.removeShape(shapeId);
  }, [actions]);

  /**
   * Validates if a new shape can be created based on limits
   * @param {string} type - Type of shape
   * @returns {boolean} - True if shape can be created
   */
  const canCreateShape = useCallback((type) => {
    const shapeCount = state.shapes.filter(s => s.type === type).length;
    const limit = SHAPE_LIMITS[type.toUpperCase()];
    
    return shapeCount < limit;
  }, [state.shapes]);

  return {
    currentLayer,
    setCurrentLayer,
    handleShapeCreated,
    handleShapeDeleted,
    canCreateShape,
    isDrawing: state.isDrawing,
    selectedTool: state.selectedTool,
    errors: state.errors
  };
}