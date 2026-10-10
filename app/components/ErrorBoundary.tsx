import { LinkButton } from '@revealui/presentation';
import { Component, type ErrorInfo, type ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Changing this value clears a caught error so navigation can recover. */
  resetKey?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  resetKey?: string;
}

export function renderErrorCopy(error: Error | null, dev: boolean): string {
  if (!dev) return 'An unexpected error occurred. Please try again.';
  return error?.message ?? 'An unexpected error occurred while rendering this page.';
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, error: null, resetKey: props.resetKey };
    }
    return null;
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info.componentStack);
  }

  private reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <DefaultErrorFallback error={this.state.error} onReset={this.reset} />
        )
      );
    }
    return this.props.children;
  }
}

function DefaultErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  useEffect(() => {
    document.title = 'Something went wrong | RevMind';
  }, []);

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-destructive">Error</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        {renderErrorCopy(error, import.meta.env.DEV)}
      </p>
      <LinkButton href="/" className="mt-6" onClick={onReset}>
        Return home
      </LinkButton>
    </div>
  );
}
