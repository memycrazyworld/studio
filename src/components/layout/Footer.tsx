
export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} WanderWeb. All rights reserved.
          <span className="mx-2">&bull;</span>
          Developed by{' '}
          <a
            href="https://ahmedshaban.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Ahmed Shaban
          </a>
          <span className="mx-2">&bull;</span>
          Powered by Uprock{' '}
          <span 
            className="inline-block align-middle ml-1 px-2 py-1 text-xs bg-muted rounded border border-border text-muted-foreground tracking-wider"
            title="Uprock Logo Placeholder"
          >
            UPROCK
          </span>
        </p>
      </div>
    </footer>
  );
}
