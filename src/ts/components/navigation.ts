import { getUser, clearUser } from "../store/userStore";
import { renderLayout } from "../app";
import { getCurrentUserProfile } from "../services/profileService";
import { openCreatePostModal } from "./modals/createPostModal";
import { goTo } from "../utils/navigate";
import { navbarSkeleton } from "./loadingSkeletons";

/**
 * Creates a navigation link element for the main navbar.
 *
 * This helper builds a fully styled anchor element containing
 * a Material Symbol icon and an optional text label. The route
 * is stored in a data attribute and handled by the SPA router.
 *
 * This function does not attach event listeners.
 *
 * @param {string} icon - Material Symbols icon name.
 * @param {string} label - Visible text label for larger screens.
 * @param {string} route - SPA route path to navigate to.
 * @returns {HTMLAnchorElement} The constructed navigation link element.
 */

function createNavLink(
  icon: string,
  label: string,
  route: string,
): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = "#";
  link.className =
    "nav-link flex flex-col items-center sm:flex-row sm:gap-3 hover:text-primary-hover";
  link.dataset.route = route;

  const iconSpan = document.createElement("span");
  iconSpan.className = "material-symbols-outlined !text-[28px]";
  iconSpan.textContent = icon;

  const textSpan = document.createElement("span");
  textSpan.className = "hidden sm:inline";
  textSpan.textContent = label;

  link.append(iconSpan, textSpan);
  return link;
}

/**
 * Creates and returns the main application navigation bar element.
 *
 * This function synchronously builds the navbar DOM structure using
 * `document.createElement`, allowing it to render immediately without
 * blocking on asynchronous data.
 *
 * The mini profile section is rendered with a loading skeleton and
 * populated later by `loadNavMiniProfile()`.
 *
 * If no authenticated user is found, the function returns `null`.
 *
 * @returns {HTMLElement | null} The navbar element, or null if no user is logged in.
 */

export function navigation(): HTMLElement | null {
  const user = getUser();
  if (!user) return null;

  const nav = document.createElement("nav");
  nav.id = "navbar";
  nav.className = `
    navbar fixed bottom-0 left-0 w-full py-3 pr-20
    flex flex-row justify-around items-center bg-white
    sm:static sm:flex-col sm:items-start sm:gap-4 sm:text-lg sm:p-8 sm:w-3xs
  `;

  const miniProfile = document.createElement("div");
  miniProfile.id = "nav-mini-profile";
  miniProfile.className =
    "profile-link hidden sm:flex gap-4 font-semibold text-lg mb-4 cursor-pointer";

  miniProfile.append(
    (() => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = navbarSkeleton();
      return wrapper;
    })(),
  );

  nav.appendChild(miniProfile);

  nav.append(
    createNavLink("home", "Home", "/feed"),
    createNavLink("search", "Search", "/search"),
    createNavLink("account_circle", "Profile", `/profile/${user.name}`),
  );

  const logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.className =
    "flex flex-col items-center sm:flex-row sm:gap-3 hover:text-primary-hover";

  logoutBtn.innerHTML = `
    <span class="material-symbols-outlined !text-[28px]">logout</span>
    <span class="hidden sm:inline">Log out</span>
  `;

  const newPostBtn = document.createElement("button");
  newPostBtn.id = "newPostBtn";
  newPostBtn.className =
    "flex items-center justify-center fixed right-4 bg-primary hover:bg-primary-hover text-white shadow-lg rounded-full mb-6 mr-2 h-14 w-14 sm:m-0 sm:py-2 sm:px-5 sm:mt-4 sm:h-auto sm:w-auto sm:shadow-none sm:gap-2 sm:static sm:mt-4 sm:b-auto sm:right-auto";

  newPostBtn.innerHTML = `
    <span class="material-symbols-outlined !text-[28px]">edit_square</span>
    <span class="hidden sm:inline">New Post</span>
  `;

  nav.append(logoutBtn, newPostBtn);

  return nav;
}

/**
 * Initializes all interactive behavior for the navigation bar.
 *
 * This function attaches event listeners for:
 * - SPA navigation links
 * - Logout button
 * - New post modal trigger
 * - Mini profile navigation
 *
 * It must be called after the navbar has been rendered into the DOM.
 *
 * @returns {void}
 */

export function initNavigation() {
  const logoutBtn = document.getElementById("logoutBtn");
  const newPostBtn = document.getElementById("newPostBtn");
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
  const miniProfile = document.getElementById("nav-mini-profile");

  logoutBtn?.addEventListener("click", () => {
    clearUser();
    renderLayout();
    goTo("/");
  });

  newPostBtn?.addEventListener("click", () => {
    openCreatePostModal();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const route = link.dataset.route;
      if (route) goTo(route);

      document.querySelector(".nav-link.active")?.classList.remove("active");
      link.classList.add("active");
    });
  });

  miniProfile?.addEventListener("click", () => {
    const user = getUser();
    if (user) goTo(`/profile/${user.name}`);
  });
}

/**
 * Loads and injects the authenticated user's mini profile into the navbar.
 *
 * This function fetches the current user's profile data asynchronously
 * and replaces the loading skeleton inside the mini profile container
 * with the user's avatar and name.
 *
 * It is safe to call this function multiple times and should be invoked
 * after each navbar render.
 *
 * @async
 * @returns {Promise<void>}
 */

export async function loadNavMiniProfile() {
  const container = document.getElementById("nav-mini-profile");
  const user = getUser();
  if (!container || !user) return;

  try {
    const profile = await getCurrentUserProfile(user.name);

    container.innerHTML = `
      <figure class="size-12">
        <img 
          class="rounded-full w-full h-full object-cover" 
          src="${profile.avatar?.url || "/default-avatar.png"}"
          alt="${profile.avatar?.alt || profile.name}" 
        />
      </figure>
      <h4>${profile.name}</h4>
    `;
  } catch (error) {
    console.error("Failed to load nav mini profile", error);
  }
}
