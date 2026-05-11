import { createSignal, createEffect, Show } from "solid-js";
import { currentUser, isAuthenticated } from "../services/auth.js";
import { addFavorite, removeFavorite, isFavorite } from "../services/db.js";

export default function FavoriteButton(props) {
  const [fav, setFav] = createSignal(false);
  const [animating, setAnimating] = createSignal(false);
  const [loading, setLoading] = createSignal(true);

  // Check initial favorite state
  createEffect(async () => {
    const user = currentUser();
    if (!user || !props.cakeId) { setLoading(false); return; }
    try {
      const result = await isFavorite(user.uid, props.cakeId);
      setFav(result);
    } catch (e) {
      console.error("Fav check error", e);
    } finally {
      setLoading(false);
    }
  });

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const user = currentUser();
    if (!user) return;

    setAnimating(true);
    try {
      if (fav()) {
        await removeFavorite(user.uid, props.cakeId);
        setFav(false);
      } else {
        await addFavorite(user.uid, props.cakeId);
        setFav(true);
      }
    } catch (err) {
      console.error("Toggle fav error", err);
    }
    setTimeout(() => setAnimating(false), 400);
  };

  const sizeClass = props.size === "sm" ? "fav-btn--sm" : "fav-btn--lg";

  return (
    <Show when={isAuthenticated()}>
      <button
        class={`fav-btn ${sizeClass} ${fav() ? "fav-btn--active" : ""} ${animating() ? "fav-btn--pulse" : ""}`}
        onClick={toggle}
        disabled={loading()}
        aria-label={fav() ? "Ukloni iz favorita" : "Dodaj u favorite"}
        title={fav() ? "Ukloni iz favorita" : "Dodaj u favorite"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fav() ? "currentColor" : "none"} stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
    </Show>
  );
}
