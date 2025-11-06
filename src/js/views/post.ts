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
import { renderComments, renderComment } from "../components/commentList";
import { initProfileLinks } from "../utils/initProfileLinks";
import { footer } from "../components/footer";
import { backHeader } from "../components/headers/backHeader";
import { postCardSkeleton } from "../components/loadingSkeletons";

export function postView() {
  return protectedView({
    header: backHeader(),
    footer: footer(),
    html: `
      <section id="postContainer"></section>
      <section id="commentsContainer" class="py-4"></section>
    `,
    init: async () => {
      const container = document.getElementById("postContainer")!;
      const commentsContainer = document.getElementById("commentsContainer")!;
      const backBtn = document.getElementById("backBtn")!;
      backBtn.addEventListener("click", () => history.back());

      container.innerHTML = postCardSkeleton();

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
          } catch (error) {
            let message = "Failed to fetch current user profile";
            if (error instanceof Error) message += `: ${error.message}`;
            console.error(message, error);
          }
        }

        const response = await getPost(id);
        if (!response) {
          container.innerHTML = `<p>Post not found</p>`;
          return;
        }
        const post = response.data;

        container.innerHTML = await postCard(post, loggedInUserFollowingNames, {
          lazy: false,
        });

        commentsContainer.innerHTML = await commentForm(post.id);
        commentsContainer.insertAdjacentHTML(
          "beforeend",
          await renderComments((post.comments || []).slice().reverse()),
        );

        initCommentForms(async (postId, body) => {
          const newComment = await addComment(postId, body);
          if (!newComment) return;
          const commentsList = commentsContainer.querySelector(
            ".comments-container",
          )!;

          const heading = commentsList.querySelector("h2");
          if (heading) {
            heading.insertAdjacentHTML(
              "afterend",
              await renderComment(newComment),
            );
          } else {
            commentsList.outerHTML = await renderComments([newComment]);
          }
          initDeleteCommentButtons(commentsContainer);
        });

        initDeleteCommentButtons(commentsContainer);
        initFollowButtons();
        initEditPostButton(post);
        initProfileLinks(container);
        initProfileLinks(commentsContainer);
      } catch (error) {
        let message = "Error loading post";
        if (error instanceof Error) message += `: ${error.message}`;
        container.innerHTML = `<p>${message}</p>`;
        console.error("postView init error:", error);
      }
    },
  });
}
