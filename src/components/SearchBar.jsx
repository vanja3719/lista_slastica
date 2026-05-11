import { Show } from "solid-js";

export default function SearchBar(props) {
  let inputRef;

  const handleInput = (e) => {
    props.onSearch(e.target.value);
  };

  const handleClear = () => {
    if (inputRef) inputRef.value = "";
    props.onSearch("");
  };

  return (
    <div class="search-bar">
      {/* Search icon */}
      <svg class="search-bar__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        placeholder="Pretražite kolače po nazivu ili oznaci..."
        class="search-bar__input"
        onInput={handleInput}
        id="search-cakes"
      />

      {/* Clear button */}
      <Show when={props.value && props.value.length > 0}>
        <button class="search-bar__clear" onClick={handleClear} aria-label="Obriši pretragu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Show>
    </div>
  );
}
