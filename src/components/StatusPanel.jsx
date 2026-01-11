import React from 'react';
import { useMap } from '../context/MapContext';

/**
 * Status panel component for debugging and showing current state
 */
export function StatusPanel() {
  const { state } = useMap();

  return (
    <div className="status-panel">
      <h4>📊 Status</h4>
      <div className="status-info">
        <p><strong>Selected Tool:</strong> {state.selectedTool || 'None'}</p>
        <p><strong>Drawing Mode:</strong> {state.isDrawing ? 'Active' : 'Inactive'}</p>
        <p><strong>Total Shapes:</strong> {state.shapes.length}</p>
        
        {state.shapes.length > 0 && (
          <details>
            <summary>Shape Details</summary>
            <ul>
              {state.shapes.map((shape, index) => (
                <li key={shape.id}>
                  {shape.type} (ID: {shape.id})
                </li>
              ))}
            </ul>
          </details>
        )}
        
        {state.errors.length > 0 && (
          <details>
            <summary>Errors ({state.errors.length})</summary>
            <ul>
              {state.errors.map((error, index) => (
                <li key={index} style={{ color: 'red' }}>
                  {error}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}