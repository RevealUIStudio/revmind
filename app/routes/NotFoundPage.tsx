import { LinkButton } from '@revealui/presentation';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-background px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-base text-muted-foreground">
          The page you are looking for is not here.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <LinkButton href="/">Return home</LinkButton>
        </div>
      </div>
    </section>
  );
}
