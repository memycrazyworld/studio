
export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} WanderWeb. All rights reserved.
          <span className="mx-2 hidden sm:inline">&bull;</span>
          <span className="block sm:inline mt-1 sm:mt-0">
            Developed by{' '}
            <a
              href="https://ahmedshaban.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Ahmed Shaban
            </a>
          </span>
          <span className="mx-2 hidden sm:inline">&bull;</span>
          <span className="block sm:inline mt-1 sm:mt-0">
          Powered by Uprock{' '}
          <span 
            className="inline-block align-middle ml-1 px-2 py-1 text-xs bg-muted rounded border border-border text-muted-foreground tracking-wider font-semibold"
            title="Uprock Logo Placeholder"
          >
            UPROCK
          </span>
          </span>
        </p>
      </div>
    </footer>
  );
}
