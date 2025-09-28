import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import {
  getPaginatedSearchPosts,
  getPaginatedSearchProfiles,
} from "../services/searchService";
import { getUser } from "../store/userStore";
import { getCurrentUserProfile } from "../services/profileService";
import { getCachedProfile } from "../utils/profileCache";
import { initPaginatedList } from "../utils/initPaginatedList";
import { profileListItem } from "../components/profileListItem";

export function searchView() {
  return protectedView({
    html: `
    <section>
    <form id="searchForm">
        <div class="flex mt-8 mb-4 bg-gray-light pl-4 border border-gray-medium rounded-full gap-2">
          <button type="submit">
          <span class="material-symbols-outlined text-gray-dark">search</span>
          </button>
        <input
          type="text"
          id="searchInput"
          placeholder="Search posts or profiles..."
          class="w-full py-4"
          required
        />
        </div>
    </form>
      <div id="searchResults">
        <div id="searchPosts" class="py-4"></div>
        <div id="postsLoadMoreContainer" class="load-more-container flex justify-center"></div>
        <div id="searchProfiles" class="py-4"></div>
        <div id="profilesLoadMoreContainer" class="load-more-container flex justify-center pt-12"></div>
      </div>
      </section>
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
  <h2 class="font-bold text-xl">Posts</h2>
  <div id="postsResults" class="py-4"></div>
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
          postsContainer.innerHTML = `<h2 class="font-bold text-xl">Posts</h2><p>No posts found.</p>`;
          postsLoadMoreContainer.innerHTML = "";
        }

        const profilesRes = await getPaginatedSearchProfiles(q, 1, 10);
        if (profilesRes.data.length > 0) {
          profilesContainer.innerHTML = `
  <h2 class="font-bold text-xl">Profiles</h2>
  <div id="profilesResults" class="py-4"></div>
`;
          const profilesResultsContainer =
            document.getElementById("profilesResults")!;
          await initPaginatedList({
            container: profilesResultsContainer,
            loadMoreContainer: profilesLoadMoreContainer,
            fetchItems: (page) => getPaginatedSearchProfiles(q, page, 10),
            renderItem: async (profile) => {
              const cachedProfile = await getCachedProfile(profile.name);
              return profileListItem(
                cachedProfile,
                loggedInUserFollowingNames.includes(cachedProfile.name)
              );
            },
          });
        } else {
          profilesContainer.innerHTML = `<h2 class="font-bold text-xl">Profiles</h2><p>No profiles found.</p>`;
          profilesLoadMoreContainer.innerHTML = "";
        }
      });
    },
  });
}
