/**
 * Inline script that runs before hydration to set the correct theme class.
 * Prevents FOUC (Flash Of Unstyled Content) on first paint.
 * This is a Server Component (no "use client") because it just emits a script tag.
 */
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('valver-theme');
        var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored || (systemPrefersDark ? 'dark' : 'light');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // Fallback: assume dark mode (matching original design)
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
