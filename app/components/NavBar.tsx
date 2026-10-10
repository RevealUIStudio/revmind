import { Link } from '@revealui/router';
import { PRODUCT_NAME } from '@/lib/honesty';

export function NavBar() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
          {PRODUCT_NAME}
        </Link>
        <a
          href="https://github.com/revealui-studio/revmind"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Source
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </header>
  );
}
