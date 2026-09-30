import { LinkButton } from '@revealui/presentation';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-background px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          This page isn't available.
        </h1>
        <p className="mt-4 max-w-md text-base text-muted-foreground">
          Return to the example graph to continue exploring.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <LinkButton href="/">Return to the example graph</LinkButton>
        </div>
      </div>
    </section>
  );
}
