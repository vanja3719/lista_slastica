import { createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { addCake } from "../services/db.js";
import { currentUser } from "../services/auth.js";
import Message from "../components/Message.jsx";

export default function AddCake() {
  const navigate = useNavigate();
  const [error, setError] = createSignal(null);
  const [submitting, setSubmitting] = createSignal(false);
  const [imagePreview, setImagePreview] = createSignal("");
  const [imageError, setImageError] = createSignal(false);

  // Dynamic ingredients
  const [ingredients, setIngredients] = createSignal([""]);
  const addIngredient = () => setIngredients([...ingredients(), ""]);
  const removeIngredient = (index) => {
    if (ingredients().length <= 1) return;
    setIngredients(ingredients().filter((_, i) => i !== index));
  };
  const updateIngredient = (index, value) => {
    const updated = [...ingredients()];
    updated[index] = value;
    setIngredients(updated);
  };

  // Dynamic steps
  const [steps, setSteps] = createSignal([""]);
  const addStep = () => setSteps([...steps(), ""]);
  const removeStep = (index) => {
    if (steps().length <= 1) return;
    setSteps(steps().filter((_, i) => i !== index));
  };
  const updateStep = (index, value) => {
    const updated = [...steps()];
    updated[index] = value;
    setSteps(updated);
  };

  const handleImageUrl = (e) => {
    setImagePreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const user = currentUser();
    if (!user) { setError("Morate biti prijavljeni."); setSubmitting(false); return; }

    const form = new FormData(e.target);
    const name = form.get("name")?.trim();
    const image = form.get("image")?.trim();
    const description = form.get("description")?.trim();
    const prepTime = form.get("prepTime")?.trim();
    const tagsRaw = form.get("tags")?.trim();
    const videoUrl = form.get("videoUrl")?.trim();

    // Validation
    if (!name || !image || !description || !prepTime) {
      setError("Popunite sva obavezna polja.");
      setSubmitting(false);
      return;
    }

    const filteredIngredients = ingredients().map(s => s.trim()).filter(Boolean);
    const filteredSteps = steps().map(s => s.trim()).filter(Boolean);

    if (filteredIngredients.length === 0) {
      setError("Dodajte barem jedan sastojak.");
      setSubmitting(false);
      return;
    }
    if (filteredSteps.length === 0) {
      setError("Dodajte barem jedan korak pripreme.");
      setSubmitting(false);
      return;
    }

    // Parse tags
    const tags = tagsRaw
      ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    // Convert YouTube watch URL to embed URL
    let embedUrl = videoUrl || "";
    if (embedUrl.includes("youtube.com/watch")) {
      const urlObj = new URL(embedUrl);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (embedUrl.includes("youtu.be/")) {
      const videoId = embedUrl.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const cakeData = {
      name,
      image,
      description,
      prepTime,
      tags,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      videoUrl: embedUrl,
      createdBy: user.uid,
      createdByName: user.displayName || user.email.split("@")[0],
      createdAt: new Date().toISOString()
    };

    try {
      const id = await addCake(cakeData);
      navigate(`/cake/${id}`);
    } catch (err) {
      setError(err.message || "Greška pri spremanju kolača.");
      setSubmitting(false);
    }
  };

  return (
    <div class="max-w-3xl mx-auto py-8">
      <a href="/" class="inline-flex items-center gap-2 text-[#7a7a7a] hover:text-[#e5989b] transition-colors mb-6 body-font font-semibold text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Natrag
      </a>

      <div class="soft-card p-8 md:p-10 bg-white">
        <h1 class="text-3xl md:text-4xl font-bold title-font text-[#4a4a4a] mb-8 text-center">
          🍰 Dodaj novi kolač
        </h1>

        <Message message={error()} type="error" />

        <form onSubmit={handleSubmit} class="flex flex-col gap-6">
          {/* Name */}
          <label class="floating-label w-full">
            <input class="input input-md w-full" type="text" name="name" placeholder="Naziv kolača" required />
            <span class="bg-white px-1">Naziv kolača *</span>
          </label>

          {/* Image URL */}
          <div>
            <label class="floating-label w-full">
              <input
                class="input input-md w-full"
                type="text"
                name="image"
                placeholder="URL slike kolača"
                required
                onInput={(e) => {
                  setImagePreview(e.target.value.trim());
                  setImageError(false);
                }}
              />
              <span class="bg-white px-1">URL slike (link) *</span>
            </label>
            <p class="text-xs text-[#aaa] mt-1.5 body-font">
              Zalijepite direktni link na sliku (npr. s Unsplash, Imgur ili desni klik → "Kopiraj adresu slike")
            </p>

            {/* Image preview */}
            <Show when={imagePreview().length > 5}>
              <div class="mt-3 rounded-xl overflow-hidden border border-[#eaeaea]">
                <Show when={!imageError()}>
                  <img
                    src={imagePreview()}
                    alt="Pregled slike"
                    class="w-full h-48 object-cover"
                    crossorigin="anonymous"
                    onError={() => setImageError(true)}
                  />
                </Show>
                <Show when={imageError()}>
                  <div class="h-48 flex flex-col items-center justify-center bg-[#fdfbf7] text-[#aaa]">
                    <span class="text-3xl mb-2">🖼️</span>
                    <p class="text-sm body-font">Slika se ne može učitati — provjerite je li link ispravan</p>
                    <p class="text-xs mt-1 body-font">Koristite direktni link (završava na .jpg, .png, .webp)</p>
                  </div>
                </Show>
              </div>
            </Show>
          </div>

          {/* Description */}
          <label class="floating-label w-full">
            <textarea
              class="comment-section__textarea"
              name="description"
              placeholder="Kratki opis kolača"
              rows="3"
              required
            />
            <span class="bg-white px-1">Opis *</span>
          </label>

          {/* Prep time */}
          <label class="floating-label w-full">
            <input class="input input-md w-full" type="text" name="prepTime" placeholder="Vrijeme pripreme (npr. 45 min)" required />
            <span class="bg-white px-1">Vrijeme pripreme *</span>
          </label>

          {/* Tags */}
          <label class="floating-label w-full">
            <input class="input input-md w-full" type="text" name="tags" placeholder="Oznake (odvojene zarezom)" />
            <span class="bg-white px-1">Oznake (npr. Čokolada, Voće, Brzo)</span>
          </label>

          {/* Ingredients */}
          <div>
            <h3 class="text-lg font-bold title-font text-[#4a4a4a] mb-3 flex items-center gap-2">
              <span>🧾</span> Sastojci *
            </h3>
            <div class="flex flex-col gap-3">
              <For each={ingredients()}>
                {(ing, index) => (
                  <div class="flex items-center gap-2">
                    <span class="ingredient-list__dot flex-shrink-0" />
                    <input
                      class="input input-sm flex-1"
                      type="text"
                      placeholder={`Sastojak ${index() + 1}`}
                      value={ing}
                      onInput={(e) => updateIngredient(index(), e.target.value)}
                    />
                    <Show when={ingredients().length > 1}>
                      <button
                        type="button"
                        class="btn btn-ghost btn-xs text-red-400 hover:text-red-600 px-2"
                        onClick={() => removeIngredient(index())}
                      >✕</button>
                    </Show>
                  </div>
                )}
              </For>
              <button type="button" class="btn btn-accent btn-xs self-start mt-1" onClick={addIngredient}>
                + Dodaj sastojak
              </button>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 class="text-lg font-bold title-font text-[#4a4a4a] mb-3 flex items-center gap-2">
              <span>👩‍🍳</span> Koraci pripreme *
            </h3>
            <div class="flex flex-col gap-3">
              <For each={steps()}>
                {(step, index) => (
                  <div class="flex items-start gap-2">
                    <span class="recipe-steps__number flex-shrink-0 mt-1" style="width:28px;height:28px;min-width:28px;font-size:0.75rem">
                      {index() + 1}
                    </span>
                    <textarea
                      class="comment-section__textarea flex-1"
                      rows="2"
                      placeholder={`Korak ${index() + 1}`}
                      value={step}
                      onInput={(e) => updateStep(index(), e.target.value)}
                      style="min-height:44px"
                    />
                    <Show when={steps().length > 1}>
                      <button
                        type="button"
                        class="btn btn-ghost btn-xs text-red-400 hover:text-red-600 px-2 mt-1"
                        onClick={() => removeStep(index())}
                      >✕</button>
                    </Show>
                  </div>
                )}
              </For>
              <button type="button" class="btn btn-accent btn-xs self-start mt-1" onClick={addStep}>
                + Dodaj korak
              </button>
            </div>
          </div>

          {/* Video URL */}
          <label class="floating-label w-full">
            <input class="input input-md w-full" type="url" name="videoUrl" placeholder="YouTube video link (opcionalno)" />
            <span class="bg-white px-1">YouTube video link (opcionalno)</span>
          </label>

          {/* Submit */}
          <div class="mt-4 flex gap-4">
            <button
              type="submit"
              class="btn btn-primary flex-1 shadow-md"
              disabled={submitting()}
            >
              {submitting() ? "Spremam..." : "🍰 Spremi kolač"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
