import { getUser, clearUser } from "../store/userStore";
import { router, renderLayout } from "../app";
import { getCurrentUserProfile } from "../services/profileService";
import { profileAvatar } from "../utils/profileAvatar";
import { openCreatePostModal } from "./createPostModal";

export async function navigation(): Promise<string> {
  const user = getUser();
  if (!user) return "";

  try {
    const profile = await getCurrentUserProfile(user.name);

    const miniProfileHtml = profileAvatar(profile, "mini");

    return `
      <nav class="navbar">
        ${miniProfileHtml}

        <ul class="nav-links">
          <li><a href="#" class="nav-link" data-route="/feed">Home</a></li>
          <li><a href="#" class="nav-link" data-route="/search">Search</a></li>
          <li><a href="#" class="nav-link" data-route="/profile/${profile.name}">Profile</a></li>
        </ul>

        <div class="nav-actions">
          <button id="newPostBtn">+ New Post</button>
          <button id="logoutBtn">Log out</button>
        </div>
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
  const miniProfile = document.querySelector(".profile-avatar.mini");

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
