import { Show } from "solid-js";
import { isAuthenticated } from "../services/auth.js";
import FavoriteButton from "./FavoriteButton.jsx";

export default function CakeCard(props) {
  const cake = props.cake;

  return (
    <a href={`/cake/${cake.id}`} class="soft-card overflow-hidden flex flex-col group cursor-pointer block no-underline">
      <div class="cake-card__image-wrap">
        <img
          src={cake.image}
          alt={cake.name}
          class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div class="absolute top-4 right-4 bg-white/90 backdrop-blur text-sm px-3 py-1.5 rounded-full text-[#e5989b] font-semibold shadow-sm">
          ⏱ {cake.prepTime}
        </div>
        <Show when={isAuthenticated()}>
          <div class="absolute top-4 left-4" onClick={(e) => e.preventDefault()}>
            <FavoriteButton cakeId={cake.id} size="sm" />
          </div>
        </Show>
      </div>

      <div class="p-5 flex flex-col flex-1">
        <h3 class="text-xl font-bold title-font text-[#4a4a4a] mb-2 group-hover:text-[#e5989b] transition-colors">
          {cake.name}
        </h3>
        <p class="text-sm text-[#7a7a7a] body-font line-clamp-2 mb-3 leading-relaxed">
          {cake.description}
        </p>
        <div class="flex flex-wrap gap-2 mt-auto pt-3">
          {(cake.tags || []).map(tag => (
            <span class="cake-tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  );
}
