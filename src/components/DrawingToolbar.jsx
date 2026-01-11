import React from 'react';
import { DRAWING_TOOLS, SHAPE_COLORS } from '../config/constants';
import { useMap } from '../context/MapContext';
import { useDrawing } from '../hooks/useDrawing';

/**
 * Drawing toolbar component with tools for different shape types
 */
export function DrawingToolbar() {
  const { actions } = useMap();
  const { selectedTool, canCreateShape, isDrawing } = useDrawing();

  const tools = [
    { 
      type: DRAWING_TOOLS.CIRCLE, 
      icon: '⭕', 
      label: 'Circle',
      color: SHAPE_COLORS.CIRCLE
    },
    { 
      type: DRAWING_TOOLS.RECTANGLE, 
      icon: '⬜', 
      label: 'Rectangle',
      color: SHAPE_COLORS.RECTANGLE
    },
    { 
      type: DRAWING_TOOLS.POLYGON, 
      icon: '⬟', 
      label: 'Polygon',
      color: SHAPE_COLORS.POLYGON
    },
    { 
      type: DRAWING_TOOLS.LINESTRING, 
      icon: '〰️', 
      label: 'Line',
      color: SHAPE_COLORS.LINESTRING
    }
  ];

  const handleToolSelect = (toolType) => {
    console.log('Tool selected:', toolType);
    if (selectedTool === toolType) {
      // Deselect if already selected
      console.log('Deselecting tool');
      actions.setSelectedTool(null);
    } else {
      // Select the tool
      console.log('Selecting tool:', toolType);
      actions.setSelectedTool(toolType);
    }
  };

  return (
    <div className="drawing-toolbar">
      <h3>Drawing Tools</h3>
      <div className="tools-container">
        {tools.map((tool) => {
          const canCreate = canCreateShape(tool.type);
          const isSelected = selectedTool === tool.type;
          
          return (
            <button
              key={tool.type}
              className={`tool-button ${isSelected ? 'selected' : ''} ${!canCreate ? 'disabled' : ''}`}
              onClick={() => handleToolSelect(tool.type)}
              disabled={!canCreate}
              title={`${tool.label} ${!canCreate ? '(limit reached)' : ''}`}
              style={{ borderColor: tool.color }}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-label">{tool.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="toolbar-info">
        {selectedTool && (
          <div className="selected-tool">
            <p>🎨 Selected: <strong>{selectedTool}</strong></p>
            <div className="drawing-instructions">
              <p><small>📍 Drawing controls will appear on map</small></p>
              <p><small>✏️ Click the drawing tool in the top-right corner of the map</small></p>
              {selectedTool === 'polygon' && <p><small>🔺 Click multiple points, double-click to finish</small></p>}
              {selectedTool === 'circle' && <p><small>⭕ Click and drag to set radius</small></p>}
              {selectedTool === 'rectangle' && <p><small>⬜ Click and drag to create bounds</small></p>}
              {selectedTool === 'linestring' && <p><small>〰️ Click multiple points, double-click to finish</small></p>}
            </div>
          </div>
        )}
        {!selectedTool && (
          <p className="no-tool-selected">
            <small>👆 Select a drawing tool above to start</small>
          </p>
        )}
      </div>
    </div>
  );
}