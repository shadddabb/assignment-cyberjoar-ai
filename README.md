# OpenStreetMap Drawing Application

A React-based web application that renders OpenStreetMap tiles and allows users to draw and manage geometrical features with non-overlapping constraints.

## Features

- **Map Rendering**: OpenStreetMap free tiles with smooth zooming and panning
- **Drawing Tools**: Circle, Rectangle, Polygon, and LineString drawing capabilities
- **Non-overlapping Constraints**: Automatic trimming and blocking of overlapping polygonal features
- **GeoJSON Export**: Export all drawn features in GeoJSON format
- **Dynamic Configuration**: Easily adjustable shape limits per type
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 19**: Frontend framework with hooks
- **Leaflet**: Interactive map library
- **React-Leaflet**: React components for Leaflet
- **Turf.js**: Geospatial analysis and polygon operations
- **Vite**: Build tool and development server
- **CSS3**: Modern styling with animations

## Project Structure

```
src/
├── components/          # React components
│   ├── MapComponent.jsx
│   ├── DrawingToolbar.jsx
│   ├── ExportPanel.jsx
│   └── ErrorDisplay.jsx
├── context/            # React Context for state management
│   └── MapContext.jsx
├── hooks/              # Custom React hooks
│   ├── useDrawing.js
│   └── useGeoExport.js
├── utils/              # Utility functions
│   └── geoUtils.js
├── config/             # Configuration constants
│   └── constants.js
├── App.jsx             # Main application component
├── App.css             # Application styles
└── index.css           # Global styles and imports
```

## Setup and Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mapassignment
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Drawing Shapes

1. **Select a drawing tool** from the sidebar (Circle, Rectangle, Polygon, or LineString)
2. **Click on the map** to start drawing
3. **Follow the on-screen instructions** for each shape type:
   - **Circle**: Click and drag to set radius
   - **Rectangle**: Click and drag to create bounds
   - **Polygon**: Click multiple points, double-click to finish
   - **LineString**: Click multiple points, double-click to finish

### Shape Limits

The application enforces maximum limits per shape type:
- **Circles**: 10
- **Rectangles**: 10
- **Polygons**: 10
- **LineStrings**: 20

These limits can be adjusted in `src/config/constants.js`.

### Non-overlapping Constraints

**Polygonal features** (Circles, Rectangles, Polygons) follow these rules:
- **No overlapping**: New shapes cannot overlap existing polygonal features
- **Auto-trimming**: If partial overlap occurs, the new shape is automatically trimmed
- **Blocking**: If a new shape would be fully enclosed, the operation is blocked with an error message

**LineStrings** are excluded from overlap constraints and can freely cross other shapes.

### Exporting Shapes

1. **Click "Export GeoJSON"** to download all shapes as a GeoJSON file
2. **Click "Preview GeoJSON"** to see the GeoJSON structure in the console
3. The exported file includes:
   - Geometry data for each shape
   - Shape type (circle, rectangle, polygon, linestring)
   - Unique ID and creation timestamp

## Polygon Overlap Logic

The application uses Turf.js for sophisticated geospatial operations:

### Overlap Detection
```javascript
// Uses turf.intersect() to detect polygon intersections
const intersection = turf.intersect(polygon1, polygon2);
return intersection !== null;
```

### Enclosure Detection
```javascript
// Uses turf.booleanPointInPolygon() to check if one polygon encloses another
const testPoint = turf.explode(innerPolygon).features[0];
return turf.booleanPointInPolygon(testPoint, outerPolygon);
```

### Auto-trimming
```javascript
// Uses turf.difference() to remove overlapping areas
const trimmed = turf.difference(newPolygon, existingPolygon);
```

### Error Handling
- **Full enclosure**: Blocks the operation and shows error message
- **Partial overlap**: Automatically trims the new shape
- **Invalid geometry**: Shows validation error and prevents creation

## Configuration

### Shape Limits
Edit `src/config/constants.js` to adjust shape limits:

```javascript
export const SHAPE_LIMITS = {
  CIRCLE: 10,        // Maximum circles
  RECTANGLE: 10,     // Maximum rectangles
  POLYGON: 10,       // Maximum polygons
  LINESTRING: 20     // Maximum linestrings
};
```

### Map Settings
Configure default map view and behavior:

```javascript
export const MAP_CONFIG = {
  DEFAULT_CENTER: [51.505, -0.09],  // London coordinates
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 1,
  MAX_ZOOM: 19
};
```

### Shape Colors
Customize colors for different shape types:

```javascript
export const SHAPE_COLORS = {
  CIRCLE: '#3388ff',
  RECTANGLE: '#ff7833',
  POLYGON: '#33ff33',
  LINESTRING: '#ff33ff'
};
```

## Sample GeoJSON Export

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-0.09, 51.505],
          [-0.08, 51.506],
          [-0.09, 51.506],
          [-0.09, 51.505]
        ]]
      },
      "properties": {
        "type": "polygon",
        "id": 1234567890,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    }
  ]
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The application follows React best practices:
- **Custom hooks** for reusable logic
- **Context API** for state management
- **Modular components** with clear responsibilities
- **Utility functions** for complex operations
- **Error handling** with user-friendly messages

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **OpenStreetMap** for map tiles
- **Leaflet** for mapping functionality
- **Turf.js** for geospatial operations
- **React** for the frontend framework
