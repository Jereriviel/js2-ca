import { getPost, addComment, deleteComment } from "../services/postsService";
import { protectedView } from "../utils/protectedView";
import { postCard, initEditPostButton } from "../components/postCard";
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
          const currentUser = getUser();

          commentsContainer.innerHTML =
            `<h2>Comments</h2>` +
            post.comments
              .map((c) => {
                const isOwnComment = currentUser?.name === c.author?.name;
                return `
        <div class="comment" data-comment-id="${c.id}" data-post-id="${
                  c.postId
                }">
          <p>${c.author?.name ?? "Unknown"}: ${c.body}</p>
          ${new Date(c.created).toLocaleString()}
          ${
            isOwnComment
              ? `<button class="delete-comment-btn" data-comment-id="${c.id}" data-post-id="${c.postId}">Delete</button>`
              : ""
          }
        </div>
      `;
              })
              .join("");
        } else {
          commentsContainer.innerHTML = `<p>No comments yet.</p>`;
        }

        commentsContainer.insertAdjacentHTML("beforeend", commentForm(post.id));

        commentsContainer
          .querySelectorAll<HTMLButtonElement>(".delete-comment-btn")
          .forEach((btn) => {
            btn.addEventListener("click", async () => {
              const commentId = Number(btn.dataset.commentId);
              const postId = Number(btn.dataset.postId);
              if (!commentId || !postId) return;

              if (!confirm("Are you sure you want to delete this comment?"))
                return;

              try {
                await deleteComment(postId, commentId);
                const commentDiv = btn.closest(".comment");
                if (commentDiv) commentDiv.remove();
              } catch (err) {
                console.error("Failed to delete comment:", err);
                alert("Failed to delete comment. Please try again.");
              }
            });
          });

        initCommentForms(async (postId, body) => {
          const newComment = await addComment(postId, body);

          commentsContainer.insertAdjacentHTML(
            "beforeend",
            `
<div class="comment" data-comment-id="${
              newComment.id
            }" data-post-id="${postId}">
      <p>${newComment.author?.name ?? newComment.owner ?? "You"}: ${
              newComment.body
            }</p>
      ${new Date(newComment.created).toLocaleString()}
      <button class="delete-comment-btn" data-comment-id="${
        newComment.id
      }" data-post-id="${postId}">Delete</button>
    </div>
  `
          );
          const newBtn = commentsContainer.querySelector<HTMLButtonElement>(
            `.delete-comment-btn[data-comment-id="${newComment.id}"]`
          );
          if (newBtn) {
            newBtn.addEventListener("click", async () => {
              if (!confirm("Are you sure you want to delete this comment?"))
                return;
              try {
                await deleteComment(postId, newComment.id);
                const div = newBtn.closest(".comment");
                if (div) div.remove();
              } catch (err) {
                console.error("Failed to delete comment:", err);
                alert("Failed to delete comment. Please try again.");
              }
            });
          }
        });

        initFollowButtons();
        initEditPostButton(post);

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
