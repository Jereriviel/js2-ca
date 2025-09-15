import { getPost } from "../services/postsService";
import { protectedView } from "../utils/protectedView";

export function postView() {
  return protectedView({
    html: `
      <div id="postContainer"></div>
    `,
    init: async () => {
      const container = document.getElementById("postContainer")!;
      container.innerHTML = `<p>Loading post...</p>`;

      try {
        const pathParts = location.pathname.split("/");
        const id = Number(pathParts[2]);

        if (isNaN(id)) {
          container.innerHTML = `<p>Invalid post ID</p>`;
          return;
        }

        const response = await getPost(id);
        const post = response.data;

        container.innerHTML = `
          <h1>${post.title}</h1>
          <p>${post.body ?? ""}</p>
          ${
            post.media
              ? `<img src="${post.media.url}" alt="${post.media.alt}" />`
              : ""
          }
        `;
      } catch (error) {
        container.innerHTML = `<p>Error loading post</p>`;
      }
    },
  });
}
