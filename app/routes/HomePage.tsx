import { GraphCanvas } from '@/components/GraphCanvas';
import { DEMO_SNAPSHOT } from '@/lib/demo-snapshot';
import { DIAGRAM_HONESTY, PRODUCT_NAME } from '@/lib/honesty';

export function HomePage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">RevealFleet</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {PRODUCT_NAME}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">{DIAGRAM_HONESTY}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-medium text-foreground">Example graph</h2>
        <GraphCanvas snapshot={DEMO_SNAPSHOT} />
      </div>
    </section>
  );
}
