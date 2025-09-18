import {
  getPaginatedSearchPosts,
  getPaginatedSearchProfiles,
} from "../services/searchService";
import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { profileCard } from "../components/profileCard";
import { router } from "../app";
import { getUser } from "../store/userStore";
import { getCurrentUserProfile } from "../services/profileService";
import { initFollowButtons } from "../components/followButton";
import { createLoadMoreButton } from "../components/loadMoreButton";
import type { Profile } from "../types/profile";

export function searchView() {
  return protectedView({
    html: `
      <h1>Search</h1>
      <form id="searchForm">
        <input
          type="text"
          id="searchInput"
          placeholder="Search posts or profiles..."
          required
        />
        <button type="submit">Search</button>
      </form>

      <div id="searchResults">
        <div id="searchPosts"></div>
        <div id="postsLoadMoreContainer"></div>
        <div id="searchProfiles"></div>
        <div id="profilesLoadMoreContainer"></div>
      </div>
    `,
    init: async () => {
      const form = document.getElementById("searchForm") as HTMLFormElement;
      const input = document.getElementById("searchInput") as HTMLInputElement;
      const resultsContainer = document.getElementById("searchResults")!;
      const postsContainer = document.getElementById("searchPosts")!;
      const postsLoadMoreContainer = document.getElementById(
        "postsLoadMoreContainer"
      )!;
      const profilesContainer = document.getElementById("searchProfiles")!;
      const profilesLoadMoreContainer = document.getElementById(
        "profilesLoadMoreContainer"
      )!;

      const currentUser = getUser();
      let loggedInUserFollowingNames: string[] = [];

      if (currentUser) {
        try {
          const currentUserProfile = await getCurrentUserProfile(
            currentUser.name
          );
          loggedInUserFollowingNames =
            currentUserProfile.following?.map((f: Profile) => f.name) || [];
        } catch (err) {
          console.error("Failed to fetch current user profile:", err);
        }
      }

      resultsContainer.addEventListener("click", (e) => {
        const target = (e.target as HTMLElement).closest(
          ".profile-link, .profile-card"
        ) as HTMLElement | null;
        if (target?.dataset.username) {
          router.navigate(`/profile/${target.dataset.username}`);
        }
      });

      let lastQuery = "";

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;

        lastQuery = q;

        postsContainer.innerHTML = `<p>Searching posts...</p>`;
        profilesContainer.innerHTML = `<p>Searching profiles...</p>`;
        postsLoadMoreContainer.innerHTML = "";
        profilesLoadMoreContainer.innerHTML = "";

        try {
          const [postsRes, profilesRes] = await Promise.all([
            getPaginatedSearchPosts(q, 1, 10),
            getPaginatedSearchProfiles(q, 1, 10),
          ]);

          let postsHtml = "";
          if (postsRes.data.length > 0) {
            const postsArr = await Promise.all(
              postsRes.data.map((post) =>
                postCard(post, loggedInUserFollowingNames)
              )
            );
            postsHtml = `<h2>Posts</h2>` + postsArr.join("");
          } else {
            postsHtml = "<p>No posts found.</p>";
          }
          postsContainer.innerHTML = postsHtml;

          let profilesHtml = "";
          if (profilesRes.data.length > 0) {
            profilesHtml =
              `<h2>Profiles</h2>` +
              profilesRes.data
                .map((profile) =>
                  profileCard(
                    profile,
                    loggedInUserFollowingNames.includes(profile.name)
                  )
                )
                .join("");
          } else {
            profilesHtml = "<p>No profiles found.</p>";
          }
          profilesContainer.innerHTML = profilesHtml;

          initFollowButtons();

          if (!postsRes.meta?.isLastPage) {
            postsLoadMoreContainer.innerHTML = "";
            const postsLoadMoreBtn = createLoadMoreButton({
              container: postsContainer,
              fetchItems: async (page: number) =>
                getPaginatedSearchPosts(q, page, 10),
              renderItem: (post) =>
                postCard(post as any, loggedInUserFollowingNames),
              onAfterRender: () => initFollowButtons(),
            });
            postsLoadMoreContainer.appendChild(postsLoadMoreBtn);
          } else {
            postsLoadMoreContainer.innerHTML = "";
          }

          if (!profilesRes.meta?.isLastPage) {
            profilesLoadMoreContainer.innerHTML = "";
            const profilesLoadMoreBtn = createLoadMoreButton({
              container: profilesContainer,
              fetchItems: async (page: number) =>
                getPaginatedSearchProfiles(q, page, 10),
              renderItem: (profile) =>
                Promise.resolve(
                  profileCard(
                    profile as any,
                    loggedInUserFollowingNames.includes((profile as any).name)
                  )
                ),
              onAfterRender: () => initFollowButtons(),
            });
            profilesLoadMoreContainer.appendChild(profilesLoadMoreBtn);
          } else {
            profilesLoadMoreContainer.innerHTML = "";
          }
        } catch (err) {
          console.error("Search failed:", err);
          postsContainer.innerHTML = `<p>Error searching posts.</p>`;
          profilesContainer.innerHTML = `<p>Error searching profiles.</p>`;
          postsLoadMoreContainer.innerHTML = "";
          profilesLoadMoreContainer.innerHTML = "";
        }
      });
    },
  });
}
