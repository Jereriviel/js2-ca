import { getUser, clearUser } from "../store/userStore";
import { router, renderLayout } from "../app";
import { getCurrentUserProfile } from "../services/profileService";
import { openCreatePostModal } from "./modals/createPostModal";

export async function navigation(): Promise<string> {
  const user = getUser();
  if (!user) return "";

  try {
    const profile = await getCurrentUserProfile(user.name);

    const miniProfileHtml = `
<div class="profile-link flex gap-4 font-semibold text-lg mb-4" data-username="${
      profile.name
    }">
      <figure class="size-12">
        <img class="rounded-full" src="${
          profile.avatar?.url || "/default-avatar.png"
        }" alt="${profile.avatar?.alt || profile.name}" />
      </figure>
      <h4>${profile.name}</h4>
    </div>
`;

    return `
        <nav class="navbar flex flex-col gap-4 text-lg">
      ${miniProfileHtml}
          <a href="#" class="nav-link flex gap-3 items-center hover:text-primary-hover" data-route="/feed">
            <span class="material-symbols-outlined" style="font-size: 2rem;">home</span>
            <p>Home</p>
          </a>
          <a href="#" class="nav-link flex gap-3 items-center hover:text-primary-hover" data-route="/search">
            <span class="material-symbols-outlined" style="font-size: 2rem;">search</span>
            <p>Search</p></a
          >
          <a href="#" class="nav-link flex gap-3 items-center hover:text-primary-hover" data-route="/profile/${profile.name}">
            <span class="material-symbols-outlined" style="font-size: 2rem;">account_circle</span>
            <p>Profile</p></a
          >
        <button id="logoutBtn" class="flex justify-start gap-3 items-center hover:text-primary-hover">
          <span class="material-symbols-outlined" style="font-size: 2rem;">logout</span>Log out
        </button>
        <button id="newPostBtn" class="flex gap-2 justify-center items-center bg-primary hover:bg-primary-hover text-white w-fit py-3 px-5 rounded-full mt-4">
          <span class="material-symbols-outlined">edit_square</span>New Post
        </button>
    </nav>
    `;
  } catch (err) {
    console.error("Failed to fetch profile for navbar", err);
    return "";
  }
}

export function initNavigation() {
  const logoutBtn = document.getElementById("logoutBtn");
  const newPostBtn = document.getElementById("newPostBtn");
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
  const miniProfile = document.querySelector(".profile-link[data-username]");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearUser();
      renderLayout();
      router.navigate("/");
    });
  }

  if (newPostBtn) {
    newPostBtn.addEventListener("click", () => {
      openCreatePostModal();
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const route = link.dataset.route;
      if (route) router.navigate(route);
    });
  });

  if (miniProfile) {
    miniProfile.addEventListener("click", () => {
      const username = miniProfile.getAttribute("data-username");
      if (username) router.navigate(`/profile/${username}`);
    });
  }
}

export async function updateNavMiniProfile() {
  const miniProfile = document.querySelector(".profile-link[data-username]");
  const user = getUser();
  if (!user || !miniProfile) return;

  try {
    const profile = await getCurrentUserProfile(user.name);

    miniProfile.outerHTML = `
      <div class="profile-link" data-username="${profile.name}">
        <img 
          class="rounded-full" 
          src="${profile.avatar?.url || "/default-avatar.png"}" 
          alt="${profile.avatar?.alt || profile.name}" 
        />
        <h4>${profile.name}</h4>
      </div>
    `;

    const newMiniProfile = document.querySelector(
      ".profile-link[data-username]"
    );
    if (newMiniProfile) {
      newMiniProfile.addEventListener("click", () => {
        router.navigate(`/profile/${profile.name}`);
      });
    }
  } catch (err) {
    console.error("Failed to update mini profile in nav", err);
  }
}
