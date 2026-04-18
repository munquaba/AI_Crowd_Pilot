"use client";
import React from "react";

/**
 * Error Boundary component that catches JavaScript errors in its child component tree.
 * Displays a graceful fallback UI instead of crashing the entire application.
 * @extends {React.Component}
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[AI Crowd Pilot] Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="glass-card p-6 text-center m-4"
        >
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400 mb-4">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30
                     text-blue-300 text-sm font-medium hover:bg-blue-500/30
                     transition-colors cursor-pointer"
            aria-label="Retry loading this section"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
