import type { Post } from "../types/post";
import { getUser } from "../store/userStore";
import { openUpdatePostModal } from "./modals/updatePostModal";
import { formatTimePost } from "../utils/formatTimePost";
import { getCurrentUserProfile } from "../services/profileService";
import type { Profile } from "../types/profile";
import { followButton } from "./followButton";

/**
 * Generates the HTML for a single blog post.
 *
 * Fetches the author's full profile if available, and renders:
 * - Author information (avatar, name, post time)
 * - Post title and body
 * - Optional media (image)
 * - Post actions (Follow/Unfollow button if not own post, Edit button if own post)
 * - Comment count
 *
 * @async
 * @function postCard
 * @param {Post} post - The post object to render.
 * @param {string[]} loggedInUserFollowing - Array of usernames that the logged-in user follows, used to determine follow button state.
 * @returns {Promise<string>} HTML string representing the post card.
 *
 * @example
 * const html = await postCard(postData, loggedInUserFollowing);
 * document.getElementById('postContainer')!.innerHTML = html;
 */

export async function postCard(
  post: Post,
  loggedInUserFollowing: string[],
  options: { lazy?: boolean } = { lazy: true },
): Promise<string> {
  const { lazy } = options;
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
    } catch (error) {
      console.warn("Failed to fetch author profile", error);
    }
  }

  return `
  <article class="post flex flex-col pt-4 w-full" data-post-id="${post.id}">
    <div class=flex>
      <div class="profile-link pr-4">
        <figure class="w-12 h-12">
          <img
            class="rounded-full w-full h-full object-cover"
            src="${authorProfile?.avatar?.url ?? "/default-avatar.png"}"
            alt="${authorProfile?.avatar?.alt ?? authorProfile?.name ?? "User avatar"}"
          />
        </figure>
      </div>
      <div class="flex flex-col grow">
        <div class="post-header flex justify-between items-start">
          <div class="profile-link flex items-start gap-1" data-username="${authorProfile?.name ?? "Unknown"}">
            <div class="flex flex-col gap-1">
              <h4 class="font-medium">${authorProfile?.name ?? "Unknown"}</h4>
              <span class="post-time text-sm text-gray-dark">${createdTime}${updatedTime}</span>
            </div>
          </div>
          <div class="post-actions flex gap-2">
            ${!isOwnPost && post.author ? followButton(post.author, isFollowing) : ""}
            ${
              isOwnPost
                ? `<button class="edit-post-btn bg-secondary hover:bg-secondary-hover text-white text-sm py-2 px-4 rounded-full" data-id="${post.id}">Edit post</button>`
                : ""
            }
          </div>
        </div>
        <div class="flex flex-col gap-1 py-3">
          <h2 class="post-link text-l font-semibold" data-id="${post.id}">${
            post.title
          }</h2>
          <p class="post-link" data-id="${post.id}">${post.body ?? ""}</p>
        </div>
        <figure>
          ${
            post.media
              ? `<img 
                class="post-link rounded-lg ${lazy ? "lazy-load" : ""} w-full max-h-[600px] object-cover" 
                data-id="${post.id}" 
                ${lazy ? `data-src="${post.media.url}" src="../public/img/placeholder.png"` : `src="${post.media.url}"`}
                alt="${post.media.alt ?? ""}"
              />`
              : ""
          }
        </figure>
        <div class="post-footer pt-3 text-sm text-gray-dark">
          <span class="post-link" data-id="${post.id}">
            ${post._count.comments} comments
          </span>
        </div>
      </div>
    </div>
    <hr class="h-[px] bg-gray-medium border-none my-4">
  </article>
`;
}

export function initEditPostButtons(posts: Post[]) {
  posts.forEach((post) => {
    const editBtn = document.querySelector<HTMLButtonElement>(
      `.edit-post-btn[data-id="${post.id}"]`,
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
    `.edit-post-btn[data-id="${post.id}"]`,
  );
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openUpdatePostModal(post);
    });
  }
}
