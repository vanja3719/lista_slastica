import { createSignal, createEffect, Show, For } from "solid-js";
import { useParams } from "@solidjs/router";
import { getCakeById } from "../services/db.js";
import { isAuthenticated } from "../services/auth.js";
import FavoriteButton from "../components/FavoriteButton.jsx";
import CommentSection from "../components/CommentSection.jsx";

export default function CakeDetail() {
  const params = useParams();
  const [cake, setCake] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  createEffect(async () => {
    try {
      const data = await getCakeById(params.id);
      if (!data) {
        setError("Kolač nije pronađen.");
      } else {
        setCake(data);
      }
    } catch (e) {
      console.error("CakeDetail load error:", e);
      setError("Greška pri učitavanju kolača.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="max-w-4xl mx-auto py-6">
      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center items-center min-h-[50vh]">
          <div class="skeleton-loader">
            <div class="skeleton-block" style="height:320px;border-radius:16px;" />
            <div class="skeleton-block" style="height:40px;width:60%;margin-top:24px;" />
            <div class="skeleton-block" style="height:20px;width:80%;margin-top:12px;" />
          </div>
        </div>
      </Show>

      {/* Error */}
      <Show when={error()}>
        <div class="soft-card p-10 text-center">
          <h2 class="text-3xl font-bold title-font text-[#e5989b] mb-4">Ups!</h2>
          <p class="text-[#7a7a7a] body-font text-lg">{error()}</p>
          <a href="/" class="btn btn-primary mt-6">← Povratak na početnu</a>
        </div>
      </Show>

      {/* Content */}
      <Show when={!loading() && cake()}>
        {/* Back button */}
        <a href="/" class="inline-flex items-center gap-2 text-[#7a7a7a] hover:text-[#e5989b] transition-colors mb-6 body-font font-semibold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Svi kolači
        </a>

        {/* Hero image */}
        <div class="cake-detail__hero soft-card overflow-hidden">
          <img
            src={cake().image}
            alt={cake().name}
            class="w-full h-[320px] md:h-[420px] object-cover"
          />
        </div>

        {/* Title + Fav + Meta */}
        <div class="mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-4xl md:text-5xl font-bold title-font text-[#4a4a4a] leading-tight">
              {cake().name}
            </h1>
            <div class="flex flex-wrap items-center gap-3 mt-4">
              <span class="inline-flex items-center gap-1.5 text-sm text-[#e5989b] font-semibold bg-[#fdf2f2] px-3 py-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {cake().prepTime}
              </span>
              <For each={cake().tags || []}>
                {(tag) => <span class="cake-tag">{tag}</span>}
              </For>
            </div>
          </div>
          <FavoriteButton cakeId={cake().id} size="lg" />
        </div>

        {/* Description */}
        <div class="soft-card p-6 md:p-8 mt-8">
          <p class="text-[#5a5a5a] body-font text-lg leading-relaxed">{cake().description}</p>
        </div>

        {/* Ingredients + Steps grid */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Ingredients */}
          <div class="soft-card p-6 md:col-span-1">
            <h2 class="text-xl font-bold title-font text-[#4a4a4a] mb-4 flex items-center gap-2">
              <span class="text-2xl">🧾</span> Sastojci
            </h2>
            <ul class="ingredient-list">
              <For each={cake().ingredients || []}>
                {(ing) => (
                  <li class="ingredient-list__item">
                    <span class="ingredient-list__dot" />
                    {ing}
                  </li>
                )}
              </For>
            </ul>
          </div>

          {/* Steps */}
          <div class="soft-card p-6 md:col-span-2">
            <h2 class="text-xl font-bold title-font text-[#4a4a4a] mb-4 flex items-center gap-2">
              <span class="text-2xl">👩‍🍳</span> Priprema
            </h2>
            <ol class="recipe-steps">
              <For each={cake().steps || []}>
                {(step, index) => (
                  <li class="recipe-steps__item">
                    <span class="recipe-steps__number">{index() + 1}</span>
                    <span class="recipe-steps__text">{step}</span>
                  </li>
                )}
              </For>
            </ol>
          </div>
        </div>

        {/* Video */}
        <Show when={cake().videoUrl}>
          <div class="soft-card p-6 md:p-8 mt-8">
            <h2 class="text-2xl font-bold title-font text-[#4a4a4a] mb-6 flex items-center gap-3">
              <span class="text-2xl">🎬</span> Video Izrada
            </h2>
            <div class="video-embed">
              <iframe
                src={cake().videoUrl}
                title={`Video: ${cake().name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="video-embed__iframe"
              />
            </div>
          </div>
        </Show>

        {/* Comments */}
        <div class="soft-card p-6 md:p-8 mt-8">
          <CommentSection cakeId={cake().id} />
        </div>
      </Show>
    </div>
  );
}
