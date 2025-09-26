import { getUser } from "../store/userStore";
import type { Comment } from "../types/post";

export function renderComments(comments: Comment[]): string {
  if (!comments || comments.length === 0) {
    return `<div class="comments-container"><p>No comments yet.</p></div>`;
  }

  const currentUser = getUser();

  return `
    <div class="comments-container flex flex-col gap-4">
      <h2 class="font-semibold text-xl">Comments</h2>
      ${comments
        .map((c) => {
          const isOwnComment = currentUser?.name === c.author?.name;
          const authorName = c.author?.name ?? (c as any).owner ?? "Unknown";
          const createdDate = c.created
            ? new Date(c.created).toLocaleString()
            : new Date().toLocaleString();

          return `
           <hr class="h-[1px] bg-gray-medium border-none">
            <div class="comment flex flex-col gap-4" data-comment-id="${
              c.id
            }" data-post-id="${c.postId}">
              <p class="font-medium text-lg">${authorName}</p>
              <p>${c.body}</p>
              <div class="flex justify-between">
              <div class="text-xs text-gray-dark">${createdDate}</div>
              ${
                isOwnComment
                  ? `<button class="delete-comment-btn hover:bg-red-500 hover:text-white text-sm font-medium w-fit py-3 px-4 rounded-full" data-comment-id="${c.id}" data-post-id="${c.postId}">Delete</button>`
                  : ""
              }
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
