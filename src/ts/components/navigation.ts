import { getUser, clearUser } from "../store/userStore";
import { renderLayout } from "../app";
import { getCurrentUserProfile } from "../services/profileService";
import { openCreatePostModal } from "./modals/createPostModal";
import { goTo } from "../utils/navigate";
import { navbarSkeleton } from "./loadingSkeletons";

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
  iconSpan.className = "material-symbols-outlined text-2xl";
  iconSpan.textContent = icon;

  const textSpan = document.createElement("span");
  textSpan.className = "hidden sm:inline";
  textSpan.textContent = label;

  link.append(iconSpan, textSpan);
  return link;
}

export function navigation(): HTMLElement | null {
  const user = getUser();
  if (!user) return null;

  const nav = document.createElement("nav");
  nav.id = "navbar";
  nav.className = `
    navbar fixed bottom-0 left-0 w-full py-2
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
    <span class="material-symbols-outlined text-2xl">logout</span>
    <span class="hidden sm:inline">Log out</span>
  `;

  const newPostBtn = document.createElement("button");
  newPostBtn.id = "newPostBtn";
  newPostBtn.className =
    "flex flex-col items-center justify-center py-1 px-2 sm:flex-row sm:gap-2 bg-primary hover:bg-primary-hover text-white rounded-full sm:py-2 sm:px-5 sm:mt-4";

  newPostBtn.innerHTML = `
    <span class="material-symbols-outlined">edit_square</span>
    <span class="hidden sm:inline">New Post</span>
  `;

  nav.append(logoutBtn, newPostBtn);

  return nav;
}

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
