import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card, CardBody } from '@nextui-org/react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(): void {
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <Card className="max-w-lg w-full">
            <CardBody className="text-center py-12 px-6">
              <div className="mb-6">
                <p className="text-6xl mb-4">⚠️</p>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              </div>
              <p className="text-gray-600 mb-6">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </p>
              {this.state.error && (
                <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg">
                  <summary className="cursor-pointer font-semibold text-sm text-gray-700 mb-2">
                    Error Details
                  </summary>
                  <code className="text-xs text-red-600 break-all">
                    {this.state.error.message}
                  </code>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  color="primary"
                  onPress={this.handleReset}
                >
                  Try Again
                </Button>
                <Button
                  color="default"
                  variant="flat"
                  onPress={() => window.location.href = '/'}
                >
                  Go Home
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
