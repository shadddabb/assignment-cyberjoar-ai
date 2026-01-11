import React from 'react';
import { MapProvider } from './context/MapContext';
import { MapComponent } from './components/MapComponent';
import { DrawingToolbar } from './components/DrawingToolbar';
import { ExportPanel } from './components/ExportPanel';
import { ErrorDisplay } from './components/ErrorDisplay';
import { StatusPanel } from './components/StatusPanel';
import './App.css';

/**
 * Main application component
 */
function App() {
  return (
    <MapProvider>
      <div className="app">
        <header className="app-header">
          <h1>OpenStreetMap Drawing Application</h1>
          <p>Draw shapes on the map with non-overlapping constraints</p>
        </header>
        
        <main className="app-main">
          <div className="sidebar">
            <DrawingToolbar />
            <StatusPanel />
            <ExportPanel />
            <ErrorDisplay />
          </div>
          
          <div className="map-wrapper">
            <MapComponent />
          </div>
        </main>
        
        <footer className="app-footer">
          <p>Built with React, Leaflet, and Turf.js</p>
        </footer>
      </div>
    </MapProvider>
  );
}

export default App
