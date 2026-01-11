import React, { createContext, useContext, useReducer } from 'react';
import { SHAPE_LIMITS } from '../config/constants';

// Initial state
const initialState = {
  shapes: [],
  selectedTool: null,
  isDrawing: false,
  errors: []
};

// Action types
const ActionTypes = {
  ADD_SHAPE: 'ADD_SHAPE',
  REMOVE_SHAPE: 'REMOVE_SHAPE',
  SET_SELECTED_TOOL: 'SET_SELECTED_TOOL',
  SET_DRAWING: 'SET_DRAWING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  CLEAR_ALL_SHAPES: 'CLEAR_ALL_SHAPES'
};

// Reducer function
function mapReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_SHAPE:
      return {
        ...state,
        shapes: [...state.shapes, action.payload]
      };
    
    case ActionTypes.REMOVE_SHAPE:
      return {
        ...state,
        shapes: state.shapes.filter(shape => shape.id !== action.payload)
      };
    
    case ActionTypes.SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.payload
      };
    
    case ActionTypes.SET_DRAWING:
      return {
        ...state,
        isDrawing: action.payload
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.payload]
      };
    
    case ActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };
    
    case ActionTypes.CLEAR_ALL_SHAPES:
      return {
        ...state,
        shapes: []
      };
    
    default:
      return state;
  }
}

// Create context
const MapContext = createContext();

// Provider component
export function MapProvider({ children }) {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // Action creators
  const actions = {
    addShape: (shape) => {
      // Check shape limits
      const shapeCount = state.shapes.filter(s => s.type === shape.type).length;
      const limit = SHAPE_LIMITS[shape.type.toUpperCase()];
      
      if (shapeCount >= limit) {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: `Maximum ${shape.type} limit (${limit}) reached`
        });
        return false;
      }
      
      dispatch({
        type: ActionTypes.ADD_SHAPE,
        payload: shape
      });
      return true;
    },
    
    removeShape: (shapeId) => {
      dispatch({
        type: ActionTypes.REMOVE_SHAPE,
        payload: shapeId
      });
    },
    
    setSelectedTool: (tool) => {
      dispatch({
        type: ActionTypes.SET_SELECTED_TOOL,
        payload: tool
      });
    },
    
    setDrawing: (isDrawing) => {
      dispatch({
        type: ActionTypes.SET_DRAWING,
        payload: isDrawing
      });
    },
    
    setError: (error) => {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error
      });
    },
    
    clearErrors: () => {
      dispatch({
        type: ActionTypes.CLEAR_ERRORS
      });
    },
    
    clearAllShapes: () => {
      dispatch({
        type: ActionTypes.CLEAR_ALL_SHAPES
      });
    }
  };

  return (
    <MapContext.Provider value={{ state, actions }}>
      {children}
    </MapContext.Provider>
  );
}

// Custom hook to use the context
export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}