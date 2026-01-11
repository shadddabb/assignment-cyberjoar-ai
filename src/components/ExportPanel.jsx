import React from 'react';
import { useGeoExport } from '../hooks/useGeoExport';

/**
 * Export panel component for GeoJSON export functionality
 */
export function ExportPanel() {
  const { exportToGeoJSON, getGeoJSONString, shapeCount } = useGeoExport();

  const handleExport = () => {
    exportToGeoJSON();
  };

  const handlePreview = () => {
    const geoJSONString = getGeoJSONString();
    console.log('GeoJSON Preview:', geoJSONString);
    
    // You could also show this in a modal or alert
    alert(`GeoJSON Preview (${shapeCount} shapes):\n\n${geoJSONString.substring(0, 500)}${geoJSONString.length > 500 ? '...' : ''}`);
  };

  return (
    <div className="export-panel">
      <h3>Export Options</h3>
      
      <div className="shape-count">
        <p>Total Shapes: <strong>{shapeCount}</strong></p>
      </div>
      
      <div className="export-buttons">
        <button 
          onClick={handleExport}
          disabled={shapeCount === 0}
          className="export-button primary"
        >
          📥 Export GeoJSON
        </button>
        
        <button 
          onClick={handlePreview}
          disabled={shapeCount === 0}
          className="export-button secondary"
        >
          👁️ Preview GeoJSON
        </button>
      </div>
      
      {shapeCount === 0 && (
        <p className="no-shapes-message">
          Draw some shapes first to export them
        </p>
      )}
    </div>
  );
}