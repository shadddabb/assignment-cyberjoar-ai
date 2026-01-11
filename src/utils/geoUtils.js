import * as turf from '@turf/turf';

/**
 * Checks if two polygons overlap using Turf.js
 * @param {Object} polygon1 - First polygon (GeoJSON format)
 * @param {Object} polygon2 - Second polygon (GeoJSON format)
 * @returns {boolean} - True if polygons overlap
 */
export function checkPolygonOverlap(polygon1, polygon2) {
  try {
    const intersection = turf.intersect(polygon1, polygon2);
    return intersection !== null;
  } catch (error) {
    console.error('Error checking polygon overlap:', error);
    return false;
  }
}

/**
 * Checks if one polygon fully encloses another
 * @param {Object} outerPolygon - Potential outer polygon
 * @param {Object} innerPolygon - Potential inner polygon
 * @returns {boolean} - True if outer polygon encloses inner polygon
 */
export function checkPolygonEnclosure(outerPolygon, innerPolygon) {
  try {
    // Get a point from the inner polygon
    const innerPolygonPoints = turf.explode(innerPolygon);
    if (innerPolygonPoints.features.length === 0) return false;
    
    const testPoint = innerPolygonPoints.features[0];
    return turf.booleanPointInPolygon(testPoint, outerPolygon);
  } catch (error) {
    console.error('Error checking polygon enclosure:', error);
    return false;
  }
}

/**
 * Trims a polygon to remove overlaps with existing polygons
 * @param {Object} newPolygon - The new polygon to trim
 * @param {Array} existingPolygons - Array of existing polygons
 * @returns {Object|null} - Trimmed polygon or null if fully enclosed
 */
export function trimPolygonOverlaps(newPolygon, existingPolygons) {
  try {
    let trimmedPolygon = newPolygon;
    
    for (const existingPolygon of existingPolygons) {
      // Check if new polygon is fully enclosed
      if (checkPolygonEnclosure(existingPolygon, newPolygon)) {
        return null; // Block the operation
      }
      
      // Check for overlap and trim if necessary
      if (checkPolygonOverlap(newPolygon, existingPolygon)) {
        const difference = turf.difference(trimmedPolygon, existingPolygon);
        if (difference) {
          trimmedPolygon = difference;
        }
      }
    }
    
    return trimmedPolygon;
  } catch (error) {
    console.error('Error trimming polygon overlaps:', error);
    return newPolygon;
  }
}

/**
 * Converts Leaflet layer to GeoJSON format
 * @param {Object} layer - Leaflet layer
 * @param {string} type - Shape type
 * @returns {Object} - GeoJSON feature
 */
export function leafletLayerToGeoJSON(layer, type) {
  const geoJSON = layer.toGeoJSON();
  return {
    ...geoJSON,
    properties: {
      type: type,
      id: layer._leaflet_id || Date.now(),
      createdAt: new Date().toISOString()
    }
  };
}

/**
 * Exports all shapes to GeoJSON format
 * @param {Array} shapes - Array of shapes
 * @returns {Object} - GeoJSON FeatureCollection
 */
export function exportToGeoJSON(shapes) {
  return {
    type: 'FeatureCollection',
    features: shapes.map(shape => ({
      type: 'Feature',
      geometry: shape.geometry,
      properties: shape.properties
    }))
  };
}