import { getAllPosts } from "../services/postsService";
import { protectedView } from "../utils/protectedView";
import { router } from "../app";
import { postCard } from "../components/postCard";

export function feedView() {
  return protectedView({
    html: `
      <h1>Feed</h1>
      <div id="feedContainer"></div>
    `,
    init: async () => {
      const container = document.getElementById("feedContainer")!;
      container.innerHTML = `<p>Loading posts...</p>`;

      try {
        const response = await getAllPosts();
        const posts = response.data;
        container.innerHTML = posts.map(postCard).join("");

        const profileLinks =
          container.querySelectorAll<HTMLElement>(".profile-link");
        profileLinks.forEach((link) => {
          const username = link.dataset.username;
          if (username) {
            link.addEventListener("click", () => {
              router.navigate(`/profile/${username}`);
            });
          }
        });
      } catch (error) {
        container.innerHTML = `<p>Error loading posts</p>`;
      }
    },
  });
}
