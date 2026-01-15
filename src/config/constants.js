// Dynamic configuration for maximum shapes per type
export const SHAPE_LIMITS = {
  CIRCLE: 10,
  RECTANGLE: 10,
  POLYGON: 10,
  LINESTRING: 20
};

// Drawing tools configuration
export const DRAWING_TOOLS = {
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle', 
  POLYGON: 'polygon',
  LINESTRING: 'linestring'
};

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [51.505, -0.09],
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 1,
  MAX_ZOOM: 19
};

// Colors for different shape types
export const SHAPE_COLORS = {
  CIRCLE: '#0066ff',
  RECTANGLE: '#ff0033',
  POLYGON: '#0066ff',
  LINESTRING: '#ff0033'
};