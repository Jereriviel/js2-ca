import { getPost, addComment } from "../services/postsService";
import { protectedView } from "../utils/protectedView";
import { postCard, initEditPostButton } from "../components/postCard";
import { getUser } from "../store/userStore";
import { getCurrentUserProfile } from "../services/profileService";
import { initFollowButtons } from "../components/followButton";
import type { Profile } from "../types/profile";

import { commentForm } from "../components/commentForm";
import { renderComments } from "../components/commentList";

import { initProfileLinks } from "../utils/initialization/initProfileLinks";
import { footer } from "../components/footer";
import { backHeader } from "../components/headers/backHeader";

import {
  postCardSkeleton,
  commentSkeleton,
} from "../components/loadingSkeletons";

import { showErrorModal } from "../components/modals/errorModal";
import { handleError } from "../errors/handleError";
import { initCommentHandlers } from "../utils/initialization/initCommentHandlers";

export function postView() {
  return protectedView({
    header: backHeader(),
    footer: footer(),
    html: `
      <section id="postContainer" class="px-4 sm:px-8"></section>
      <section id="commentsContainer" class="py-4 px-4 sm:px-8"></section>
    `,

    init: async () => {
      const container = document.getElementById("postContainer")!;
      const commentsContainer = document.getElementById("commentsContainer")!;
      const backBtn = document.getElementById("backBtn")!;

      backBtn.addEventListener("click", () => history.back());

      container.innerHTML = postCardSkeleton();
      commentsContainer.innerHTML = `
        ${commentSkeleton()}
        ${Array.from({ length: 3 })
          .map(() => commentSkeleton())
          .join("")}
      `;

      try {
        const id = Number(location.pathname.split("/")[2]);
        if (isNaN(id)) {
          container.textContent = "Invalid post ID";
          return;
        }

        const currentUser = getUser();
        if (!currentUser) return;

        let profile: Profile | undefined;
        let loggedInUserFollowingNames: string[] = [];

        try {
          profile = await getCurrentUserProfile(currentUser.name);
          loggedInUserFollowingNames =
            profile.following?.map((f: Profile) => f.name) || [];
        } catch (error) {
          await showErrorModal(
            `Error loading user profile: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          );
        }

        const response = await getPost(id);

        if (!response) {
          await showErrorModal("Post not found.");
          container.textContent = "Post not found";
          return;
        }

        const post = response.data;

        container.innerHTML = "";
        container.appendChild(
          await postCard(post, loggedInUserFollowingNames, {
            lazy: false,
          }),
        );

        commentsContainer.innerHTML = "";

        if (!profile) return;

        const formEl = await commentForm(post.id, profile);
        commentsContainer.appendChild(formEl);

        const refreshComments = async (postId: number) => {
          const refreshed = await getPost(postId);
          if (!refreshed) return;

          const updatedComments =
            refreshed.data.comments?.slice().reverse() || [];

          const newCommentsList = await renderComments(updatedComments);

          const oldList = commentsContainer.querySelector(
            ".comments-container",
          );

          oldList?.remove();
          commentsContainer.appendChild(newCommentsList);
        };

        await refreshComments(post.id);

        initCommentHandlers(async (postId, body) => {
          await addComment(postId, body);
          await refreshComments(postId);
        });

        initFollowButtons();
        initEditPostButton(post);
        initProfileLinks(container);
        initProfileLinks(commentsContainer);
      } catch (error) {
        await showErrorModal(handleError(error));
        container.textContent = "Failed to load post";
      }
    },
  });
}
