import { searchPosts, searchProfiles } from "../services/searchService";
import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { profileCard } from "../components/profileCard";
import { router } from "../app";

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
      <div id="searchResults"></div>
    `,
    init: () => {
      const form = document.getElementById("searchForm") as HTMLFormElement;
      const input = document.getElementById("searchInput") as HTMLInputElement;
      const resultsContainer = document.getElementById("searchResults")!;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        resultsContainer.innerHTML = `<p>Searching...</p>`;

        try {
          const [postsRes, profilesRes] = await Promise.all([
            searchPosts(input.value),
            searchProfiles(input.value),
          ]);

          const postsHtml =
            postsRes.data.length > 0
              ? `<h2>Posts</h2>` + postsRes.data.map(postCard).join("")
              : "<p>No posts found.</p>";

          const profilesHtml =
            profilesRes.data.length > 0
              ? `<h2>Profiles</h2>` + profilesRes.data.map(profileCard).join("")
              : "<p>No profiles found.</p>";

          resultsContainer.innerHTML = postsHtml + profilesHtml;

          const profileLinks =
            resultsContainer.querySelectorAll<HTMLElement>(".profile-card");
          profileLinks.forEach((card) => {
            const username = card.dataset.username;
            if (username) {
              card.addEventListener("click", () => {
                router.navigate(`/profile/${username}`);
              });
            }
          });
        } catch (error) {
          resultsContainer.innerHTML = `<p>Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }</p>`;
        }
      });
    },
  });
}
