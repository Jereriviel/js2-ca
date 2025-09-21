import type { Post } from "../types/post";
import { getUser } from "../store/userStore";
import { openUpdatePostModal } from "./updatePostModal";

export function postCard(post: Post, loggedInUserFollowing: string[]): string {
  const isFollowing = post.author?.name
    ? loggedInUserFollowing.includes(post.author.name)
    : false;
  const loggedInUser = getUser();
  const isOwnPost = loggedInUser?.name === post.author?.name;

  return `
    <div class="post" data-post-id="${post.id}">
      <h2 class="post-link" data-id="${post.id}">${post.title}</h2>
      <p class="post-link" data-id="${post.id}">${post.body ?? ""}</p>
      ${
        post.media
          ? `<img 
              class="post-link" 
              data-id="${post.id}" 
              src="${post.media.url}" 
              alt="${post.media.alt ?? ""}"/>`
          : ""
      }
      <div class="post-meta">
        <p>
          By: <span class="profile-link" data-username="${post.author?.name}">
            ${post.author?.name ?? "Unknown"}
          </span>
        </p>
        <p>
          <span class="post-link" data-id="${post.id}">
            ${post._count.comments} comments
          </span> · 
          <span>
            ${post._count.reactions} reactions
          </span>
      </p>
        <p>
          <button class="follow-btn" 
            data-username="${post.author?.name}" 
            data-following="${isFollowing}">
            ${isFollowing ? "Unfollow" : "Follow"}
          </button>
                    ${
                      isOwnPost
                        ? `<button class="edit-post-btn" data-id="${post.id}">Edit</button>`
                        : ""
                    }
        </p>
      </div>
    </div>
  `;
}

export function initEditPostButtons(posts: Post[]) {
  posts.forEach((post) => {
    const editBtn = document.querySelector<HTMLButtonElement>(
      `.edit-post-btn[data-id="${post.id}"]`
    );
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        openUpdatePostModal(post);
      });
    }
  });
}

export function initEditPostButton(post: Post) {
  const editBtn = document.querySelector<HTMLButtonElement>(
    `.edit-post-btn[data-id="${post.id}"]`
  );
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openUpdatePostModal(post);
    });
  }
}
