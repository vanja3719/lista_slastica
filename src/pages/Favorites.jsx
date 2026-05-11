import { createSignal, createEffect, Show, For } from "solid-js";
import { currentUser } from "../services/auth.js";
import { getFavoriteIds, getCakeById } from "../services/db.js";
import CakeCard from "../components/CakeCard.jsx";

export default function Favorites() {
  const [cakes, setCakes] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  createEffect(async () => {
    const user = currentUser();
    if (!user) { setLoading(false); return; }

    try {
      const ids = await getFavoriteIds(user.uid);
      if (ids.length === 0) {
        setCakes([]);
        setLoading(false);
        return;
      }
      // Fetch each cake — getCakeById already has local fallback
      const results = await Promise.all(ids.map(id => getCakeById(id)));
      setCakes(results.filter(Boolean));
    } catch (e) {
      console.error("Error loading favorites", e);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="max-w-6xl mx-auto py-6">
      <div class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-bold title-font text-[#4a4a4a]">
          Moji <span class="text-[#e5989b] italic">Favoriti</span>
        </h1>
        <p class="text-[#7a7a7a] body-font mt-3 text-lg">Vaši omiljeni kolači na jednom mjestu</p>
      </div>

      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center py-16">
          <span class="loading loading-spinner loading-lg text-[#e5989b]"></span>
        </div>
      </Show>

      {/* Empty state */}
      <Show when={!loading() && cakes().length === 0}>
        <div class="soft-card p-12 text-center max-w-lg mx-auto">
          <div class="text-6xl mb-6">💔</div>
          <h2 class="text-2xl font-bold title-font text-[#4a4a4a] mb-3">Nemate favorita</h2>
          <p class="text-[#7a7a7a] body-font mb-6">
            Pregledajte naše kolače i dodajte omiljene klikom na srce!
          </p>
          <a href="/" class="btn btn-primary">🍰 Pregledaj kolače</a>
        </div>
      </Show>

      {/* Grid */}
      <Show when={!loading() && cakes().length > 0}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={cakes()}>
            {(cake) => <CakeCard cake={cake} />}
          </For>
        </div>
      </Show>
    </div>
  );
}
