import type { Post } from "../types/post";
import { getUser } from "../store/userStore";
import { openUpdatePostModal } from "./modals/updatePostModal";
import { formatTimePost } from "../utils/formatTimePost";
import { getCurrentUserProfile } from "../services/profileService";
import type { Profile } from "../types/profile";

export async function postCard(
  post: Post,
  loggedInUserFollowing: string[]
): Promise<string> {
  const isFollowing = post.author?.name
    ? loggedInUserFollowing.includes(post.author.name)
    : false;
  const loggedInUser = getUser();
  const isOwnPost = loggedInUser?.name === post.author?.name;
  const createdTime = formatTimePost(post.created);
  const updatedTime =
    post.updated && post.updated !== post.created
      ? ` (updated ${formatTimePost(post.updated)})`
      : "";

  let authorProfile: Profile | undefined = post.author;
  if (post.author?.name) {
    try {
      authorProfile = await getCurrentUserProfile(post.author.name);
    } catch (err) {
      console.warn("Failed to fetch author profile", err);
    }
  }

  const authorHtml = authorProfile
    ? `
      <div class="profile-link" data-username="${authorProfile.name}">
        <img
          class="rounded-full"
          src="${authorProfile.avatar?.url || "/default-avatar.png"}"
          alt="${authorProfile.avatar?.alt || authorProfile.name}"
        />
        <h4>${authorProfile.name}</h4>
      </div>
    `
    : `<span>Unknown</span>`;

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
        <p>${authorHtml}</p>
        <p class="post-time">${createdTime}${updatedTime}</p>
        <p>
          <span class="post-link" data-id="${post.id}">${
    post._count.comments
  } comments</span> · 
          <span>${post._count.reactions} reactions</span>
        </p>
        <p>
          ${
            !isOwnPost
              ? `<button class="follow-btn" data-username="${
                  post.author?.name
                }" data-following="${isFollowing}">
                   ${isFollowing ? "Unfollow" : "Follow"}
                 </button>`
              : ""
          }
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
