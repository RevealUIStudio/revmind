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
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Source
        </a>
      </div>
    </header>
  );
}
