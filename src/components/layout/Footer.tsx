export function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Uprock Getaways. All rights reserved.</p>
        <p className="mt-1">Powered by Adventure and AI.</p>
      </div>
    </footer>
  );
}
