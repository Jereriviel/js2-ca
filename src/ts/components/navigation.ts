import { getUser, clearUser } from "../store/userStore";
import { renderLayout } from "../app";
import { getCurrentUserProfile } from "../services/profileService";
import { openCreatePostModal } from "./modals/createPostModal";
import { goTo } from "../utils/navigate";
import { navbarSkeleton } from "./loadingSkeletons";
import { showErrorModal } from "./modals/errorModal";
import { handleError } from "../errors/handleError";

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

export function navigation(): HTMLElement | null {
  const user = getUser();

  if (!user) return null;

  const nav = document.createElement("nav");
  nav.id = "navbar";
  nav.className = `
    navbar fixed bottom-0 left-0 w-full py-3 pr-20
    flex flex-row justify-around items-center bg-white
    sm:static sm:flex-col sm:items-start sm:gap-4 sm:text-lg sm:py-8 sm:px-4 sm:w-3xs sm:h-full sm:justify-start
  `;

  // MINI PROFILE (skeleton)
  const miniProfile = document.createElement("div");
  miniProfile.id = "nav-mini-profile";
  miniProfile.className =
    "profile-link w-full hidden sm:flex gap-4 font-semibold text-lg mb-4 cursor-pointer min-w-0";

  const skeletonWrapper = document.createElement("div");
  skeletonWrapper.innerHTML = navbarSkeleton();
  miniProfile.appendChild(skeletonWrapper);

  nav.appendChild(miniProfile);

  nav.append(
    createNavLink("home", "Home", "/feed"),
    createNavLink("search", "Search", "/search"),
    createNavLink("account_circle", "Profile", `/profile/${user.name}`),
  );

  // LOGOUT BUTTON
  const logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.className =
    "flex flex-col items-center sm:flex-row sm:gap-3 hover:text-primary-hover";

  const logoutIcon = document.createElement("span");
  logoutIcon.className = "material-symbols-outlined !text-[28px]";
  logoutIcon.textContent = "logout";

  const logoutText = document.createElement("span");
  logoutText.className = "hidden sm:inline";
  logoutText.textContent = "Log out";

  logoutBtn.append(logoutIcon, logoutText);

  // NEW POST BUTTON
  const newPostBtn = document.createElement("button");
  newPostBtn.id = "newPostBtn";
  newPostBtn.className =
    "flex items-center justify-center fixed right-4 bg-primary hover:bg-primary-hover text-white shadow-lg rounded-full mb-6 mr-2 h-14 w-14 sm:m-0 sm:py-2 sm:px-5 sm:mt-4 sm:h-auto sm:w-auto sm:shadow-none sm:gap-2 sm:static sm:mt-4 sm:b-auto sm:right-auto";

  const newPostIcon = document.createElement("span");
  newPostIcon.className = "material-symbols-outlined !text-[28px]";
  newPostIcon.textContent = "edit_square";

  const newPostText = document.createElement("span");
  newPostText.className = "hidden sm:inline";
  newPostText.textContent = "New Post";

  newPostBtn.append(newPostIcon, newPostText);

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

    const figure = document.createElement("figure");
    figure.className = "size-12 flex shrink-0";

    const img = document.createElement("img");
    img.className = "rounded-full w-full h-full object-cover";
    img.src = profile.avatar?.url || "/default-avatar.png";
    img.alt = profile.avatar?.alt || profile.name;

    const nameEmailContainer = document.createElement("div");
    nameEmailContainer.className = "flex flex-col w-full min-w-0";

    const name = document.createElement("h4");
    name.textContent = profile.name;
    name.className = "break-words";

    const email = document.createElement("p");
    email.textContent = profile.email;
    email.className = "text-sm font-normal text-gray-dark break-words";

    nameEmailContainer.append(name, email);

    container.innerHTML = "";
    figure.appendChild(img);
    container.append(figure, nameEmailContainer);
  } catch (error) {
    await showErrorModal(handleError(error));

    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center gap-2 text-sm text-gray-dark";

    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.textContent = "error";

    const text = document.createElement("span");
    text.textContent = "Profile unavailable";

    wrapper.append(icon, text);
    container.appendChild(wrapper);
  }
}
