'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary Component for ChatBot
 * Catches and handles React errors gracefully
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ChatBot Error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Store error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Optional: Send error to logging service
    // logErrorToService(error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="w-80 bg-red-900/90 backdrop-blur-sm border border-red-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-red-200 font-medium text-sm mb-2">
                  Chat Temporarily Unavailable
                </h3>
                
                <p className="text-red-300/80 text-xs mb-4 leading-relaxed">
                  Something went wrong with the chat. Please try refreshing or contact support if the problem persists.
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={this.resetErrorBoundary}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 
                             text-red-200 text-xs rounded-lg transition-colors duration-200
                             border border-red-500/30 hover:border-red-500/50"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-2 text-red-300 text-xs hover:text-red-200 
                             transition-colors duration-200"
                  >
                    Refresh Page
                  </button>
                </div>
                
                {/* Development error details */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 p-3 bg-red-950/50 rounded-lg border border-red-800/50">
                    <summary className="text-red-300 text-xs cursor-pointer hover:text-red-200">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <div className="text-red-400 text-xs font-medium">Error:</div>
                        <pre className="text-red-300/80 text-xs whitespace-pre-wrap break-words">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <div className="text-red-400 text-xs font-medium">Stack:</div>
                          <pre className="text-red-300/60 text-xs whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;