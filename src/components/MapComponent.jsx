import React from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { useMap as useMapContext } from '../context/MapContext';
import { useDrawing } from '../hooks/useDrawing';
import { MAP_CONFIG, SHAPE_COLORS } from '../config/constants';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Component to handle drawing controls using react-leaflet-draw
 */
function DrawingControls() {
  const { actions } = useMapContext();
  const { handleShapeCreated, handleShapeDeleted, selectedTool } = useDrawing();

  // Configure draw options based on selected tool
  const getDrawOptions = () => {
    const baseOptions = {
      edit: {
        remove: true
      },
      draw: {
        polygon: false,
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false
      }
    };

    if (!selectedTool) return baseOptions;

    switch (selectedTool) {
      case 'polygon':
        baseOptions.draw.polygon = {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> Shape edges cannot cross!'
          },
          shapeOptions: {
            color: SHAPE_COLORS.POLYGON,
            fillColor: SHAPE_COLORS.POLYGON,
            fillOpacity: 0.3
          }
        };
        break;
      case 'circle':
        baseOptions.draw.circle = {
          shapeOptions: {
            color: SHAPE_COLORS.CIRCLE,
            fillColor: SHAPE_COLORS.CIRCLE,
            fillOpacity: 0.3
          }
        };
        break;
      case 'rectangle':
        baseOptions.draw.rectangle = {
          shapeOptions: {
            color: SHAPE_COLORS.RECTANGLE,
            fillColor: SHAPE_COLORS.RECTANGLE,
            fillOpacity: 0.3
          }
        };
        break;
      case 'linestring':
        baseOptions.draw.polyline = {
          shapeOptions: {
            color: SHAPE_COLORS.LINESTRING,
            weight: 3
          }
        };
        break;
    }

    return baseOptions;
  };

  const handleCreated = (e) => {
    console.log('Shape created:', e);
    const layer = e.layer;
    const drawType = e.layerType;
    
    // Convert draw type to our internal type
    let shapeType;
    switch (drawType) {
      case 'polygon':
        shapeType = 'polygon';
        break;
      case 'circle':
        shapeType = 'circle';
        break;
      case 'rectangle':
        shapeType = 'rectangle';
        break;
      case 'polyline':
        shapeType = 'linestring';
        break;
      default:
        console.log('Unknown shape type:', drawType);
        return;
    }

    console.log('Processing shape:', shapeType);
    
    // Handle shape creation with constraints
    const success = handleShapeCreated(layer, shapeType);
    
    if (success) {
      console.log('Shape added successfully');
      // Deselect tool after successful drawing
      actions.setSelectedTool(null);
    } else {
      console.log('Shape creation failed, removing layer');
    }
  };

  const handleDeleted = (e) => {
    console.log('Shape deleted:', e);
    const layers = e.layers;
    layers.eachLayer((layer) => {
      handleShapeDeleted(layer._leaflet_id);
    });
  };

  const drawOptions = getDrawOptions();

  // Only show EditControl when a tool is selected
  if (!selectedTool) {
    return null;
  }

  return (
    <EditControl
      position="topright"
      onCreated={handleCreated}
      onDeleted={handleDeleted}
      onEdited={handleCreated}
      draw={drawOptions.draw}
      edit={drawOptions.edit}
    />
  );
}

/**
 * Main map component with OpenStreetMap tiles and drawing capabilities
 */
export function MapComponent() {
  const { state } = useMapContext();

  return (
    <div className="map-container">
      <MapContainer
        center={MAP_CONFIG.DEFAULT_CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FeatureGroup>
          <DrawingControls />
        </FeatureGroup>
      </MapContainer>
      
      {/* Error display */}
      {state.errors.length > 0 && (
        <div className="error-overlay">
          {state.errors.map((error, index) => (
            <div key={index} className="error-message">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}