
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
          Powered by Uprock 
          <span className="inline-block ml-1 px-1.5 py-0.5 text-xs bg-muted rounded align-middle">[Uprock Logo]</span>
        </p>
      </div>
    </footer>
  );
}
