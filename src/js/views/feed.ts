// import { getAllPosts } from "../services/postsService";
// import { protectedView } from "../utils/protectedView";
// import { router } from "../app";
// import { postCard } from "../components/postCard";
// import { initFollowButtons } from "../components/followButton";
// import { getCurrentUserProfile } from "../services/profileService";
// import { getUser } from "../store/userStore";
// import type { Profile } from "../types/profile";

// export function feedView() {
//   return protectedView({
//     html: `
//       <h1>Feed</h1>
//       <div id="feedContainer"></div>
//     `,
//     init: async () => {
//       const container = document.getElementById("feedContainer")!;
//       container.innerHTML = `<p>Loading posts...</p>`;

//       try {
//         const response = await getAllPosts();
//         const posts = response.data;

//         const currentUser = getUser();
//         let currentUserFollowing: Profile[] = [];

//         if (currentUser) {
//           const profile = await getCurrentUserProfile(currentUser.name);
//           currentUserFollowing = profile.following ?? [];
//         }

//         // Map posts to HTML asynchronously
//         const postsHtml = await Promise.all(
//           posts.map((post) => {
//             const isFollowing = currentUserFollowing.some(
//               (f) => f.name === post.author?.name
//             );
//             return postCard(post, isFollowing);
//           })
//         );

//         container.innerHTML = postsHtml.join("");

//         // Add click listeners to profile links
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
//       } catch (error) {
//         container.innerHTML = `<p>Error loading posts</p>`;
//         console.error(error);
//       }
//     },
//   });
// }

import { getAllPosts } from "../services/postsService";
import { protectedView } from "../utils/protectedView";
import { router } from "../app";
import { postCard } from "../components/postCard";
import { initFollowButtons } from "../components/followButton";
import { getCurrentUserProfile } from "../services/profileService";
import { getUser } from "../store/userStore";
import type { Profile } from "../types/profile";

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

        container
          .querySelectorAll<HTMLElement>(".profile-link")
          .forEach((link) => {
            const username = link.dataset.username;
            if (username) {
              link.addEventListener("click", () => {
                router.navigate(`/profile/${username}`);
              });
            }
          });

        initFollowButtons();
      } catch (error) {
        container.innerHTML = `<p>Error loading posts</p>`;
        console.error(error);
      }
    },
  });
}
