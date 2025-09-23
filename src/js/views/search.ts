import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { profileCard } from "../components/profileCard";
import {
  getPaginatedSearchPosts,
  getPaginatedSearchProfiles,
} from "../services/searchService";
import { getUser } from "../store/userStore";
import { getCurrentUserProfile } from "../services/profileService";
import { getCachedProfile } from "../utils/profileCache";
import { initPaginatedList } from "../utils/initPaginatedList";

export function searchView() {
  return protectedView({
    html: `
      <h1>Search</h1>
      <form id="searchForm">
        <input type="text" id="searchInput" placeholder="Search posts or profiles..." required />
        <button type="submit">Search</button>
      </form>
      <div id="searchResults">
        <div id="searchPosts"></div>
        <div id="postsLoadMoreContainer" class="load-more-container"></div>
        <div id="searchProfiles"></div>
        <div id="profilesLoadMoreContainer" class="load-more-container"></div>
      </div>
    `,
    init: async () => {
      const form = document.getElementById("searchForm") as HTMLFormElement;
      const input = document.getElementById("searchInput") as HTMLInputElement;
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
        const profile = await getCurrentUserProfile(currentUser.name);
        loggedInUserFollowingNames =
          profile.following?.map((f) => f.name) || [];
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;

        postsContainer.innerHTML = "";
        profilesContainer.innerHTML = "";

        const postsRes = await getPaginatedSearchPosts(q, 1, 10);
        if (postsRes.data.length > 0) {
          postsContainer.innerHTML = `
  <h2>Posts</h2>
  <div id="postsResults"></div>
`;
          const postsResultsContainer =
            document.getElementById("postsResults")!;
          await initPaginatedList({
            container: postsResultsContainer,
            loadMoreContainer: postsLoadMoreContainer,
            fetchItems: (page) => getPaginatedSearchPosts(q, page, 10),
            renderItem: (post) => postCard(post, loggedInUserFollowingNames),
            isPostList: true,
          });
        } else {
          postsContainer.innerHTML = `<h2>Posts</h2><p>No posts found.</p>`;
          postsLoadMoreContainer.innerHTML = "";
        }

        const profilesRes = await getPaginatedSearchProfiles(q, 1, 10);
        if (profilesRes.data.length > 0) {
          profilesContainer.innerHTML = `
  <h2>Profiles</h2>
  <div id="profilesResults"></div>
`;
          const profilesResultsContainer =
            document.getElementById("profilesResults")!;
          await initPaginatedList({
            container: profilesResultsContainer,
            loadMoreContainer: profilesLoadMoreContainer,
            fetchItems: (page) => getPaginatedSearchProfiles(q, page, 10),
            renderItem: async (profile) => {
              const cachedProfile = await getCachedProfile(profile.name);
              return profileCard(
                cachedProfile,
                loggedInUserFollowingNames.includes(cachedProfile.name)
              );
            },
          });
        } else {
          profilesContainer.innerHTML = `<h2>Profiles</h2><p>No profiles found.</p>`;
          profilesLoadMoreContainer.innerHTML = "";
        }
      });
    },
  });
}
