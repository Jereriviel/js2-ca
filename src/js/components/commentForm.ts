export function commentForm(postId: number): string {
  return `
    <form class="comment-form" data-post-id="${postId}">
      <textarea 
        name="comment" 
        placeholder="Write a comment..." 
        required
      ></textarea>
      <button type="submit">Post Comment</button>
    </form>
  `;
}

export function initCommentForms(
  onSubmit: (postId: number, body: string) => Promise<void>
) {
  document
    .querySelectorAll<HTMLFormElement>(".comment-form")
    .forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const postId = Number(form.dataset.postId);
        const textarea = form.querySelector<HTMLTextAreaElement>("textarea")!;
        const body = textarea.value.trim();
        if (!body) return;

        try {
          await onSubmit(postId, body);
          textarea.value = "";
        } catch (err) {
          console.error("Failed to post comment:", err);
        }
      });
    });
}
