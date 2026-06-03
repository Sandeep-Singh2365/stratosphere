export function WireFooter() {
  return (
    <footer className="bg-wire-card border-t border-wire-border mt-12 py-8 px-6 text-wire-muted text-sm text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/stratosphere"
            target="_blank"
            rel="noreferrer"
            className="text-wire-muted hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm10.25 1.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6z"/>
            </svg>
          </a>
          <a
            href="https://twitter.com/stratosphere"
            target="_blank"
            rel="noreferrer"
            className="text-wire-muted hover:text-white transition-colors"
            aria-label="X / Twitter"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M18.9 2H22l-6.77 7.73L22.5 22h-5.7l-4.47-6.2L6.9 22H3.8l7.3-8.35L1.5 2h5.85l4.04 5.64L16.9 2zm-1 18h1.72L6.74 4H4.9l13 16z"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com/company/stratosphere"
            target="_blank"
            rel="noreferrer"
            className="text-wire-muted hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M6.94 6.5a2.19 2.19 0 1 1 0-4.38a2.19 2.19 0 0 1 0 4.38zM5 8h3.88v12H5V8zm6.34 0H15v1.64h.05c.5-.95 1.72-1.96 3.54-1.96c3.78 0 4.48 2.49 4.48 5.72V20H19.2v-5.64c0-1.35-.03-3.1-1.89-3.1c-1.89 0-2.18 1.47-2.18 3V20h-3.79V8z"/>
            </svg>
          </a>
        </div>
        <div>
          © {new Date().getFullYear()} Stratosphere Wire. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
