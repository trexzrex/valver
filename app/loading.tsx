import { Flask } from "@phosphor-icons/react/dist/ssr";

export default function Loading() {
  return (
    <main className="route-loading" aria-busy="true" aria-live="polite">
      <div className="loading-instrument" aria-hidden="true">
        <Flask size={34} weight="duotone" />
        <span className="loading-beam" />
      </div>
      <p className="loading-title">Menyiapkan Valver</p>
      <p className="loading-caption">Memuat ruang kerja analisis</p>
      <div className="loading-progress" aria-hidden="true"><span /></div>
    </main>
  );
}
