import type { Post } from "../types/post";

export function postCard(post: Post, loggedInUserFollowing: string[]): string {
  const isFollowing = post.author?.name
    ? loggedInUserFollowing.includes(post.author.name)
    : false;

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
          <button class="follow-btn" data-username="${
            post.author?.name
          }" data-following="${isFollowing}">
            ${isFollowing ? "Unfollow" : "Follow"}
          </button>
        </p>
      </div>
    </div>
  `;
}
