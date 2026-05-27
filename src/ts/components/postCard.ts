import type { Post } from "../types/post";
import { getUser } from "../store/userStore";
import { openUpdatePostModal } from "./modals/updatePostModal";
import { formatTimePost } from "../utils/formatTimePost";
import { getCurrentUserProfile } from "../services/profileService";
import type { Profile } from "../types/profile";
import { followButton } from "./followButton";
import { showErrorModal } from "./modals/errorModal";
import { handleError } from "../errors/handleError";

export async function postCard(
  post: Post,
  loggedInUserFollowing: string[],
  options: { lazy?: boolean } = { lazy: true },
): Promise<HTMLElement> {
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
      await showErrorModal(handleError(error));
    }
  }

  const article = document.createElement("article");
  article.className = "post flex flex-col pt-4 w-full";
  article.dataset.postId = String(post.id);

  const wrapper = document.createElement("div");
  wrapper.className = "flex";

  // LEFT PROFILE
  const profileWrapper = document.createElement("div");
  profileWrapper.className = "profile-link pr-4";

  const figure = document.createElement("figure");
  figure.className = "w-12 h-12";

  const img = document.createElement("img");
  img.className = "rounded-full w-full h-full object-cover";

  img.src = authorProfile?.avatar?.url ?? "/default-avatar.png";

  img.alt = authorProfile?.avatar?.alt ?? authorProfile?.name ?? "User avatar";

  figure.appendChild(img);
  profileWrapper.appendChild(figure);

  // MAIN COLUMN
  const main = document.createElement("div");
  main.className = "flex flex-col grow";

  // HEADER
  const header = document.createElement("div");
  header.className = "post-header flex justify-between items-start";

  const authorBox = document.createElement("div");
  authorBox.className = "profile-link flex items-start gap-1";

  authorBox.dataset.username = authorProfile?.name ?? "Unknown";

  const textBox = document.createElement("div");
  textBox.className = "flex flex-col gap-1";

  const name = document.createElement("h4");
  name.className = "font-medium";
  name.textContent = authorProfile?.name ?? "Unknown";

  const time = document.createElement("span");
  time.className = "post-time text-sm text-gray-dark";
  time.textContent = createdTime + updatedTime;

  textBox.append(name, time);
  authorBox.appendChild(textBox);

  const actions = document.createElement("div");
  actions.className = "post-actions flex gap-2";

  if (!isOwnPost && post.author) {
    actions.appendChild(followButton(post.author, isFollowing));
  }

  if (isOwnPost) {
    const editBtn = document.createElement("button");
    editBtn.className =
      "edit-post-btn bg-secondary hover:bg-secondary-hover text-white text-sm py-2 px-4 rounded-full shrink-0";

    editBtn.dataset.id = String(post.id);
    editBtn.textContent = "Edit post";

    actions.appendChild(editBtn);
  }

  header.append(authorBox, actions);

  // CONTENT
  const content = document.createElement("div");
  content.className = "flex flex-col gap-1 py-3";

  const title = document.createElement("h2");
  title.className = "post-link text-l font-semibold";
  title.dataset.id = String(post.id);
  title.textContent = post.title;

  const body = document.createElement("p");
  body.className = "post-link";
  body.dataset.id = String(post.id);
  body.textContent = post.body ?? "";

  content.append(title, body);

  // MEDIA
  const figureMedia = document.createElement("figure");

  if (post.media) {
    const imgMedia = document.createElement("img");

    imgMedia.className =
      "post-link rounded-lg w-full max-h-[600px] object-cover";

    imgMedia.dataset.id = String(post.id);

    if (lazy) {
      imgMedia.dataset.src = post.media.url;
      imgMedia.src = "/img/placeholder.png";
      imgMedia.classList.add("lazy-load");
    } else {
      imgMedia.src = post.media.url;
    }

    imgMedia.alt = post.media.alt ?? "";

    figureMedia.appendChild(imgMedia);
  }

  // FOOTER
  const footer = document.createElement("div");
  footer.className = "post-footer pt-3 text-sm text-gray-dark";

  const comments = document.createElement("span");
  comments.className = "post-link";
  comments.dataset.id = String(post.id);
  comments.textContent = `${post._count.comments} comments`;

  footer.appendChild(comments);

  // ASSEMBLE
  main.append(header, content, figureMedia, footer);
  wrapper.append(profileWrapper, main);
  article.appendChild(wrapper);

  const hr = document.createElement("hr");
  hr.className = "h-[1px] bg-gray-medium border-none my-4";

  article.appendChild(hr);

  return article;
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
