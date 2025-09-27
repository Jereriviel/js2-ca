import { getPost, addComment } from "../services/postsService";
import { protectedView } from "../utils/protectedView";
import { postCard, initEditPostButton } from "../components/postCard";
import { getUser } from "../store/userStore";
import { getCurrentUserProfile } from "../services/profileService";
import { initFollowButtons } from "../components/followButton";
import type { Profile } from "../types/profile";
import {
  commentForm,
  initCommentForms,
  initDeleteCommentButtons,
} from "../components/commentForm";
import { renderComments } from "../components/commentList";
import { initProfileLinks } from "../utils/initProfileLinks";

export function postView() {
  return protectedView({
    html: `
    <header class="flex items-center gap-2 pt-8">
    <span class="material-symbols-outlined">arrow_left_alt</span>
      <button id="backBtn" class="font-semibold text-xl">Post</button>
    </header>
      <div id="postContainer"></div>
      <div id="commentsContainer"></div>
    `,
    init: async () => {
      const container = document.getElementById("postContainer")!;
      const commentsContainer = document.getElementById("commentsContainer")!;
      const backBtn = document.getElementById("backBtn")!;
      backBtn.addEventListener("click", () => history.back());

      container.innerHTML = `<p>Loading post...</p>`;

      try {
        const id = Number(location.pathname.split("/")[2]);
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

        container.innerHTML = await postCard(post, loggedInUserFollowingNames);

        commentsContainer.innerHTML = commentForm(post.id);
        commentsContainer.insertAdjacentHTML(
          "beforeend",
          renderComments(post.comments || [])
        );

        initCommentForms(async (postId, body) => {
          const newComment = await addComment(postId, body);
          const commentsList = commentsContainer.querySelector(
            ".comments-container"
          )!;
          commentsList.insertAdjacentHTML(
            "beforeend",
            renderComments([newComment])
          );
          initDeleteCommentButtons(commentsContainer);
        });

        initDeleteCommentButtons(commentsContainer);
        initFollowButtons();
        initEditPostButton(post);
        initProfileLinks(container);
        initProfileLinks(commentsContainer);
      } catch (error) {
        container.innerHTML = `<p>Error loading post</p>`;
        console.error(error);
      }
    },
  });
}
