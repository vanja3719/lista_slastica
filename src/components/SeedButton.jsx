import { createSignal, Show } from "solid-js";
import { seedCakes } from "../services/db.js";
import { cakesData } from "../data/cakes.js";

export default function SeedButton() {
  const [loading, setLoading] = createSignal(false);
  const [result, setResult] = createSignal(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    try {
      const count = await seedCakes(cakesData);
      setResult({ ok: true, message: `Dodano ${count} novih kolača u bazu!` });
    } catch (err) {
      setResult({ ok: false, message: `Greška: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="mt-6 pt-6 border-t border-[#eaeaea]">
      <p class="text-xs text-[#aaa] mb-3 body-font">Admin alat — dodaj početne kolače u bazu</p>
      <button
        class="btn btn-secondary btn-sm w-full"
        onClick={handleSeed}
        disabled={loading()}
      >
        {loading() ? "Dodajem kolače..." : "🍰 Napuni bazu kolačima"}
      </button>
      <Show when={result()}>
        <p class={`text-sm mt-3 font-semibold text-center ${result().ok ? "text-emerald-600" : "text-red-500"}`}>
          {result().message}
        </p>
      </Show>
    </div>
  );
}
