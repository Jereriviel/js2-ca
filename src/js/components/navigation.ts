import { getUser, clearUser } from "../store/userStore";
import { renderLayout } from "../app";
import { getCurrentUserProfile } from "../services/profileService";
import { openCreatePostModal } from "./modals/createPostModal";
import { goTo } from "../utils/navigate";

/**
 * Generates the HTML for the main application navigation bar.
 *
 * The navbar displays the user's mini profile, navigation links (Home, Search, Profile),
 * and action buttons (Logout, New Post). On small screens, the navbar is fixed to the bottom
 * with only icons visible; on larger screens (sm breakpoint and above), it appears as a
 * vertical sidebar with text labels and the mini profile visible.
 *
 * @async
 * @function navigation
 * @returns {Promise<string>} HTML string representing the navigation bar.
 * @throws Will log an error to the console if the user profile cannot be fetched.
 *
 * @example
 * const navHtml = await navigation();
 * document.getElementById('navbar')!.innerHTML = navHtml;
 */

export async function navigation(): Promise<string> {
  const user = getUser();
  if (!user) return "";

  try {
    const profile = await getCurrentUserProfile(user.name);

    return `
  <nav 
    class="navbar 
           fixed bottom-0 left-0 w-full py-2
           flex flex-row justify-around items-center bg-white 
           sm:static sm:flex-col sm:items-start sm:gap-4 sm:text-lg sm:p-8 sm:w-3xs">
    <div class="profile-link hidden sm:flex gap-4 font-semibold text-lg mb-4" data-username="${
      profile.name
    }">
      <figure class="size-12">
        <img class="rounded-full w-full h-auto object-cover" 
             src="${profile.avatar?.url || "/default-avatar.png"}" 
             alt="${profile.avatar?.alt || profile.name}" />
      </figure>
      <h4>${profile.name}</h4>
    </div>
    <a href="#" class="nav-link flex flex-col items-center sm:flex-row sm:gap-3 hover:text-primary-hover sm:flex-none" data-route="/feed">
      <span class="material-symbols-outlined text-2xl">home</span>
      <span class="hidden sm:inline">Home</span>
    </a>
    <a href="#" class="nav-link flex flex-col items-center sm:flex-row sm:gap-3 hover:text-primary-hover sm:flex-none" data-route="/search">
      <span class="material-symbols-outlined text-2xl">search</span>
      <span class="hidden sm:inline">Search</span>
    </a>
    <a href="#" class="nav-link flex flex-col items-center sm:flex-row sm:gap-3 hover:text-primary-hover sm:flex-none" data-route="/profile/${
      profile.name
    }">
      <span class="material-symbols-outlined text-2xl">account_circle</span>
      <span class="hidden sm:inline">Profile</span>
    </a>
    <button id="logoutBtn" class="flex flex-col items-center sm:flex-row sm:gap-3 hover:text-primary-hover sm:flex-none">
      <span class="material-symbols-outlined text-2xl">logout</span>
      <span class="hidden sm:inline">Log out</span>
    </button>
    <button id="newPostBtn" class="flex flex-col items-center justify-center p-2 sm:flex-row sm:gap-2 bg-primary hover:bg-primary-hover text-white rounded-full sm:py-3 sm:px-5 mt-0 sm:mt-4 sm:flex-none">
      <span class="material-symbols-outlined">edit_square</span>
      <span class="hidden sm:inline">New Post</span>
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
      goTo("/");
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
      if (route) goTo(route);
    });
  });

  if (miniProfile) {
    miniProfile.addEventListener("click", () => {
      const username = miniProfile.getAttribute("data-username");
      if (username) goTo(`/profile/${username}`);
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
        goTo(`/profile/${profile.name}`);
      });
    }
  } catch (err) {
    console.error("Failed to update mini profile in nav", err);
  }
}
