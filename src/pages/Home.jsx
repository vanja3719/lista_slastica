import { createSignal, createEffect, Show, For } from "solid-js";
import { isAuthenticated } from "../services/auth.js";
import { getCakes, searchCakes } from "../services/db.js";
import CakeCard from "../components/CakeCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function Home() {
  const [allCakes, setAllCakes] = createSignal([]);
  const [filteredCakes, setFilteredCakes] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [error, setError] = createSignal(null);

  // Load cakes from Firestore
  createEffect(async () => {
    try {
      const data = await getCakes();
      setAllCakes(data);
      setFilteredCakes(data);
    } catch (e) {
      console.error("Error loading cakes", e);
      setError("Greška pri dohvaćanju kolača iz baze. Provjerite Firestore pravila.");
    } finally {
      setLoading(false);
    }
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = searchCakes(allCakes(), query);
    setFilteredCakes(results);
  };

  return (
    <div class="max-w-6xl mx-auto flex flex-col gap-10">
      {/* Hero sekcija */}
      <div class="soft-card mt-8 p-10 md:p-14 lg:p-20 text-center flex flex-col items-center justify-center bg-gradient-to-b from-[#fdfbf7] to-[#ffffff]">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 title-font text-[#4a4a4a] leading-tight">
          Pronađi svoju <br class="hidden md:block"/><span class="text-[#e5989b] italic">slatku inspiraciju.</span>
        </h1>
        <p class="py-4 text-lg md:text-xl text-[#7a7a7a] body-font max-w-2xl mx-auto font-light">
          Pregledajte našu pažljivo odabranu listu najukusnijih kolača, razne recepte i slastice za sve prigode. Spremajte omiljene i uživajte u jednostavnosti.
        </p>
        
        <Show when={!isAuthenticated()}>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full max-w-md">
            <a href="/user/signup" class="btn btn-primary btn-lg flex-1">Registracija</a>
            <a href="/user/signin" class="btn btn-accent btn-lg flex-1">Prijava</a>
          </div>
        </Show>

        <Show when={isAuthenticated()}>
          <div class="flex flex-wrap gap-4 justify-center mt-8">
            <a href="/app/add" class="btn btn-primary btn-lg px-10 shadow-md">🍰 Dodaj kolač</a>
            <a href="/app/favorites" class="btn btn-accent btn-lg px-10 shadow-md">❤️ Moji Favoriti</a>
          </div>
        </Show>
      </div>

      {/* Search + Grid */}
      <div class="mt-4 mb-10">
        <h2 class="text-3xl font-bold title-font text-[#4a4a4a] text-center mb-8">Svi Kolači</h2>

        {/* Search */}
        <div class="max-w-xl mx-auto mb-10">
          <SearchBar onSearch={handleSearch} value={searchQuery()} />
        </div>

        {/* Error */}
        <Show when={error()}>
          <div class="soft-card p-8 text-center max-w-lg mx-auto">
            <div class="text-4xl mb-4">⚠️</div>
            <p class="text-[#7a7a7a] body-font">{error()}</p>
          </div>
        </Show>

        {/* Loading */}
        <Show when={loading()}>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="skeleton-card" />
            <div class="skeleton-card" />
            <div class="skeleton-card" />
          </div>
        </Show>

        {/* Empty database */}
        <Show when={!loading() && !error() && allCakes().length === 0}>
          <div class="soft-card p-10 text-center max-w-lg mx-auto">
            <div class="text-5xl mb-4">🍰</div>
            <p class="text-lg text-[#7a7a7a] body-font mb-4">
              Baza kolača je prazna.
            </p>
            <Show when={isAuthenticated()}>
              <p class="text-sm text-[#aaa] body-font mb-6">
                Napunite bazu kroz Profil stranicu ili dodajte kolače ručno.
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/app/add" class="btn btn-primary">🍰 Dodaj kolač</a>
                <a href="/app/profile" class="btn btn-accent">⚙️ Profil (Seed)</a>
              </div>
            </Show>
            <Show when={!isAuthenticated()}>
              <p class="text-sm text-[#aaa] body-font mb-6">
                Prijavite se da biste dodali kolače.
              </p>
              <a href="/user/signin" class="btn btn-primary">Prijava</a>
            </Show>
          </div>
        </Show>

        {/* No results */}
        <Show when={!loading() && filteredCakes().length === 0 && allCakes().length > 0}>
          <div class="text-center py-12">
            <div class="text-5xl mb-4">🔍</div>
            <p class="text-xl text-[#7a7a7a] body-font">
              Nema rezultata za "<span class="font-semibold text-[#e5989b]">{searchQuery()}</span>"
            </p>
            <button class="btn btn-accent btn-sm mt-4" onClick={() => handleSearch("")}>Pokaži sve</button>
          </div>
        </Show>

        {/* Cake grid */}
        <Show when={!loading() && filteredCakes().length > 0}>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <For each={filteredCakes()}>
              {(cake) => <CakeCard cake={cake} />}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}