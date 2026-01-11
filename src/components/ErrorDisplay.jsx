import React from 'react';
import { useMap } from '../context/MapContext';

/**
 * Error display component for showing drawing and validation errors
 */
export function ErrorDisplay() {
  const { state, actions } = useMap();

  if (state.errors.length === 0) {
    return null;
  }

  const handleDismissError = (index) => {
    const newErrors = state.errors.filter((_, i) => i !== index);
    // Update context to remove the specific error
    // This would require adding a dismiss error action to the context
    actions.clearErrors();
  };

  return (
    <div className="error-display">
      {state.errors.map((error, index) => (
        <div key={index} className="error-item">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button 
            className="error-dismiss"
            onClick={() => handleDismissError(index)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}