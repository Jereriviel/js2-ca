// import { protectedView } from "../utils/protectedView";
// import { router } from "../app";
// import { postCard } from "../components/postCard";
// import { initFollowButtons } from "../components/followButton";
// import { getCurrentUserProfile } from "../services/profileService";
// import { getUser } from "../store/userStore";
// import type { Profile } from "../types/profile";
// import { createLoadMoreButton } from "../components/loadMorePosts";
// import { getPaginatedPosts } from "../services/postsService";

// export function feedView() {
//   return protectedView({
//     html: `
//       <h1>Feed</h1>
//       <div id="feedContainer"></div>
//       <div id="loadMoreContainer"></div>
//     `,
//     init: async () => {
//       const container = document.getElementById("feedContainer")!;
//       container.innerHTML = `<p>Loading posts...</p>`;

//       try {
//         const response = await getPaginatedPosts(1, 10);
//         const posts = response.data;

//         const currentUser = getUser();
//         let currentUserFollowing: Profile[] = [];

//         if (currentUser) {
//           const profile = await getCurrentUserProfile(currentUser.name);
//           currentUserFollowing = profile.following ?? [];
//         }

//         const currentUserFollowingNames = currentUserFollowing.map(
//           (f) => f.name
//         );

//         const postsHtml = posts.map((post) =>
//           postCard(post, currentUserFollowingNames)
//         );
//         container.innerHTML = postsHtml.join("");

//         container
//           .querySelectorAll<HTMLElement>(".profile-link")
//           .forEach((link) => {
//             const username = link.dataset.username;
//             if (username) {
//               link.addEventListener("click", () => {
//                 router.navigate(`/profile/${username}`);
//               });
//             }
//           });

//         initFollowButtons();

//         const loadMoreContainer = document.getElementById("loadMoreContainer")!;
//         const loadMoreBtn = createLoadMoreButton({
//           container,
//           fetchItems: async (page: number) => await getPaginatedPosts(page, 10),
//           renderItem: (post) => postCard(post, currentUserFollowingNames),
//           onAfterRender: () => initFollowButtons(),
//         });
//         loadMoreContainer.appendChild(loadMoreBtn);
//       } catch (error) {
//         container.innerHTML = `<p>Error loading posts</p>`;
//         console.error(error);
//       }
//     },
//   });
// }

import { protectedView } from "../utils/protectedView";
import { router } from "../app";
import { postCard } from "../components/postCard";
import { initFollowButtons } from "../components/followButton";
import { getCurrentUserProfile } from "../services/profileService";
import { getUser } from "../store/userStore";
import type { Profile } from "../types/profile";
import { createLoadMoreButton } from "../components/loadMoreButton";
import { getPaginatedPosts } from "../services/postsService";

export function feedView() {
  return protectedView({
    html: `
      <h1>Feed</h1>
      <div id="feedContainer"></div>
      <div id="loadMoreContainer"></div>
    `,
    init: async () => {
      const container = document.getElementById("feedContainer")!;
      container.innerHTML = `<p>Loading posts...</p>`;

      try {
        const response = await getPaginatedPosts(1, 10);
        const posts = response.data;

        const currentUser = getUser();
        let currentUserFollowing: Profile[] = [];

        if (currentUser) {
          const profile = await getCurrentUserProfile(currentUser.name);
          currentUserFollowing = profile.following ?? [];
        }

        const currentUserFollowingNames = currentUserFollowing.map(
          (f) => f.name
        );

        const postsHtml = posts.map((post) =>
          postCard(post, currentUserFollowingNames)
        );
        container.innerHTML = postsHtml.join("");

        container.addEventListener("click", (e) => {
          const target = (e.target as HTMLElement).closest(
            ".profile-link"
          ) as HTMLElement | null;
          if (target?.dataset.username) {
            router.navigate(`/profile/${target.dataset.username}`);
          }
        });

        initFollowButtons();

        const loadMoreContainer = document.getElementById("loadMoreContainer")!;
        const loadMoreBtn = createLoadMoreButton({
          container,
          fetchItems: async (page: number) => await getPaginatedPosts(page, 10),
          renderItem: (post) => postCard(post, currentUserFollowingNames),
          onAfterRender: () => initFollowButtons(),
        });
        loadMoreContainer.appendChild(loadMoreBtn);
      } catch (error) {
        container.innerHTML = `<p>Error loading posts</p>`;
        console.error(error);
      }
    },
  });
}
