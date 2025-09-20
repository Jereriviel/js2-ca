import { getPost, addComment, reactToPost } from "../services/postsService";
import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { getUser } from "../store/userStore";
import { getCurrentUserProfile } from "../services/profileService";
import { initFollowButtons } from "../components/followButton";
import { router } from "../app";
import type { Profile } from "../types/profile";
import { commentForm, initCommentForms } from "../components/commentForm";

export function postView() {
  return protectedView({
    html: `
      <header>
        <button id="backBtn">← Back</button>
        <h1>Post</h1>
      </header>
      <div id="postContainer"></div>
      <div id="commentsContainer"></div>
    `,
    init: async () => {
      const container = document.getElementById("postContainer")!;
      const commentsContainer = document.getElementById("commentsContainer")!;
      const backBtn = document.getElementById("backBtn")!;

      backBtn.addEventListener("click", () => {
        history.back();
      });

      container.innerHTML = `<p>Loading post...</p>`;

      try {
        const pathParts = location.pathname.split("/");
        const id = Number(pathParts[2]);

        if (isNaN(id)) {
          container.innerHTML = `<p>Invalid post ID</p>`;
          return;
        }

        const currentUser = getUser();
        let loggedInUserFollowingNames: string[] = [];

        if (currentUser) {
          try {
            const profile = await getCurrentUserProfile(currentUser.name);
            loggedInUserFollowingNames =
              profile.following?.map((f: Profile) => f.name) || [];
          } catch (err) {
            console.error("Failed to fetch current user profile:", err);
          }
        }

        const response = await getPost(id);
        const post = response.data;

        const postHtml = await postCard(post, loggedInUserFollowingNames);
        container.innerHTML = postHtml;

        if (post.comments && post.comments.length > 0) {
          commentsContainer.innerHTML =
            `<h2>Comments</h2>` +
            post.comments
              .map(
                (c) => `
                <div class="comment">
                  <p>${c.author?.name ?? "Unknown"}: ${c.body}</p>
                  ${new Date(c.created).toLocaleString()}
                </div>
              `
              )
              .join("");
        } else {
          commentsContainer.innerHTML = `<p>No comments yet.</p>`;
        }

        commentsContainer.insertAdjacentHTML("beforeend", commentForm(post.id));

        initCommentForms(async (postId, body) => {
          const newComment = await addComment(postId, body);

          commentsContainer.insertAdjacentHTML(
            "beforeend",
            `
    <div class="comment">
      <p>${newComment.author?.name ?? newComment.owner ?? "You"}:${
              newComment.body
            }</p>
      ${new Date(newComment.created).toLocaleString()}
    </div>
  `
          );
        });

        initFollowButtons();

        container.addEventListener("click", (e) => {
          const target = (e.target as HTMLElement).closest(
            ".profile-link"
          ) as HTMLElement | null;
          if (target?.dataset.username) {
            router.navigate(`/profile/${target.dataset.username}`);
          }
        });

        commentsContainer.addEventListener("click", (e) => {
          const target = (e.target as HTMLElement).closest(
            ".profile-link"
          ) as HTMLElement | null;
          if (target?.dataset.username) {
            router.navigate(`/profile/${target.dataset.username}`);
          }
        });
      } catch (error) {
        container.innerHTML = `<p>Error loading post</p>`;
        console.error(error);
      }
    },
  });
}
