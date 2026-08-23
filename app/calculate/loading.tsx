export default function Loading() {
  return (
    <main className="route-loading route-loading-calculate" aria-busy="true" aria-live="polite">
      <div className="loading-skeleton loading-calc-header" />
      <div className="loading-calc-tabs"><span /><span /><span /><span /></div>
      <div className="loading-calc-body">
        <div className="loading-skeleton loading-calc-title" />
        <div className="loading-skeleton loading-table" />
      </div>
    </main>
  );
}
