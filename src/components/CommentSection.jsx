import { createSignal, createEffect, Show, For } from "solid-js";
import { currentUser, isAuthenticated } from "../services/auth.js";
import { addComment, getComments } from "../services/db.js";

export default function CommentSection(props) {
  const [comments, setComments] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [submitting, setSubmitting] = createSignal(false);
  const [text, setText] = createSignal("");

  // Load comments
  createEffect(async () => {
    if (!props.cakeId) return;
    try {
      const data = await getComments(props.cakeId);
      setComments(data);
    } catch (e) {
      console.error("Load comments error", e);
    } finally {
      setLoading(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = currentUser();
    if (!user || !text().trim()) return;

    setSubmitting(true);
    try {
      await addComment(props.cakeId, {
        userId: user.uid,
        userName: user.displayName || user.email.split("@")[0],
        text: text().trim()
      });
      // Refresh comments
      const data = await getComments(props.cakeId);
      setComments(data);
      setText("");
    } catch (err) {
      console.error("Submit comment error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  return (
    <div class="comment-section">
      <h3 class="text-2xl font-bold title-font text-[#4a4a4a] mb-6 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-[#e5989b]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        Komentari ({comments().length})
      </h3>

      {/* Form */}
      <Show when={isAuthenticated()} fallback={
        <div class="comment-section__login-prompt">
          <p>
            <a href="/user/signin" class="text-[#e5989b] font-semibold hover:underline">Prijavite se</a> da biste ostavili komentar.
          </p>
        </div>
      }>
        <form onSubmit={handleSubmit} class="comment-section__form">
          <textarea
            class="comment-section__textarea"
            placeholder="Napišite komentar ili savjet..."
            rows="3"
            value={text()}
            onInput={(e) => setText(e.target.value)}
            required
          />
          <button
            type="submit"
            class="btn btn-primary btn-sm self-end"
            disabled={submitting() || !text().trim()}
          >
            {submitting() ? "Šaljem..." : "Objavi komentar"}
          </button>
        </form>
      </Show>

      {/* Comments list */}
      <Show when={loading()}>
        <div class="flex justify-center py-8">
          <span class="loading loading-spinner loading-md text-[#e5989b]"></span>
        </div>
      </Show>

      <Show when={!loading() && comments().length === 0}>
        <p class="text-center text-[#aaa] body-font py-6 italic">Još nema komentara. Budite prvi!</p>
      </Show>

      <Show when={!loading() && comments().length > 0}>
        <div class="comment-section__list">
          <For each={comments()}>
            {(comment) => (
              <div class="comment-card">
                <div class="comment-card__header">
                  <div class="comment-card__avatar">
                    {comment.userName?.charAt(0)?.toUpperCase() || "K"}
                  </div>
                  <div>
                    <span class="comment-card__name">{comment.userName}</span>
                    <span class="comment-card__date">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
                <p class="comment-card__text">{comment.text}</p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
