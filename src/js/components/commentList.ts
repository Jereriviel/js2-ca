import { getUser } from "../store/userStore";
import type { Comment } from "../types/post";

export function renderComments(comments: Comment[]): string {
  if (!comments || comments.length === 0) {
    return `<div class="comments-container"><p>No comments yet.</p></div>`;
  }

  const currentUser = getUser();

  return `
    <div class="comments-container">
      <h2>Comments</h2>
      ${comments
        .map((c) => {
          const isOwnComment = currentUser?.name === c.author?.name;
          const authorName = c.author?.name ?? (c as any).owner ?? "Unknown";
          const createdDate = c.created
            ? new Date(c.created).toLocaleString()
            : new Date().toLocaleString();

          return `
            <div class="comment" data-comment-id="${c.id}" data-post-id="${
            c.postId
          }">
              <p>${authorName}: ${c.body}</p>
              ${createdDate}
              ${
                isOwnComment
                  ? `<button class="delete-comment-btn" data-comment-id="${c.id}" data-post-id="${c.postId}">Delete</button>`
                  : ""
              }
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
