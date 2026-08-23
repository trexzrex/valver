export default function Loading() {
  return (
    <main className="route-loading route-loading-form" aria-busy="true" aria-live="polite">
      <div className="loading-skeleton loading-back" />
      <div className="loading-skeleton loading-heading" />
      <div className="loading-skeleton loading-copy" />
      <div className="loading-form-skeleton">
        <span /><span /><span /><b />
      </div>
    </main>
  );
}
