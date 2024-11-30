export const Footer = () => {
  return (
    <footer className="mt-8 py-4 border-t border-border">
      <div className="flex justify-center gap-8 text-sm text-muted-foreground">
        <a 
          href="https://chromarx.frameless.co/privacy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Privacy Policy
        </a>
        <a 
          href="https://chromarx.frameless.co/contact" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Contact Us
        </a>
      </div>
    </footer>
  );
};