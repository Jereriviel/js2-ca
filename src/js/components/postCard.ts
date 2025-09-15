import type { Post } from "../types/post";
import { formatTimePost } from "../utils/formatTimePost";

export function postCard(post: Post): string {
  return `
    <div class="post">
      <h2>${post.title}</h2>
      <p>${post.body ?? ""}</p>
      ${
        post.media
          ? `<img src="${post.media.url}" alt="${post.media.alt ?? ""}"/>`
          : ""
      }
      <div class="post-meta">
        <p>
          By: <span class="profile-link" data-username="${post.author?.name}">
            ${post.author?.name ?? "Unknown"}
          </span>
        </p>
        <p>
          ${post._count.comments} comments · ${post._count.reactions} reactions
        </p>
        <p>
          Posted ${formatTimePost(post.created)}
        </p>
      </div>
    </div>
  `;
}
