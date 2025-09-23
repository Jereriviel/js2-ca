import { getUser } from "../../store/userStore";
import { getProfile, updateProfile } from "../../services/profileService";
import { profileCard, initProfileCard } from "../profileCard";
import type { Profile } from "../../types/profile";
import { updateNavMiniProfile } from "../navigation";
import { showErrorModal } from "../modals/errorModal";

export async function openEditProfileModal() {
  const currentUser = getUser();
  if (!currentUser) return;

  const profile: Profile = await getProfile(currentUser.name);

  const existingModal = document.querySelector<HTMLDialogElement>(
    ".edit-profile-modal"
  );
  if (existingModal) existingModal.remove();

  const modal = document.createElement("dialog");
  modal.classList.add("edit-profile-modal");

  modal.innerHTML = `
    <form method="dialog" class="edit-profile-form">
      <h2>Edit Profile</h2>
      <label>
        Bio:
        <textarea name="bio" placeholder="Your bio">${
          profile.bio ?? ""
        }</textarea>
      </label>
      <label>
        Avatar URL:
        <input type="url" name="avatarUrl" placeholder="https://..." value="${
          profile.avatar?.url ?? ""
        }" />
      </label>
      <label>
        Avatar alt text:
        <input type="text" name="avatarAlt" placeholder="Avatar alt text" value="${
          profile.avatar?.alt ?? ""
        }" />
      </label>
      <label>
        Banner URL:
        <input type="url" name="bannerUrl" placeholder="https://..." value="${
          profile.banner?.url ?? ""
        }" />
      </label>
      <label>
        Banner alt text:
        <input type="text" name="bannerAlt" placeholder="Banner alt text" value="${
          profile.banner?.alt ?? ""
        }" />
      </label>
      <div class="modal-actions">
        <button type="submit">Save</button>
        <button type="button" id="cancelBtn">Cancel</button>
      </div>
      <p class="error-message" style="color:red;"></p>
    </form>
  `;

  document.body.appendChild(modal);
  modal.showModal();

  const form = modal.querySelector<HTMLFormElement>("form.edit-profile-form")!;
  const cancelBtn = form.querySelector<HTMLButtonElement>("#cancelBtn")!;
  const errorEl = form.querySelector<HTMLParagraphElement>(".error-message")!;

  cancelBtn.addEventListener("click", () => modal.close());

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const formData = new FormData(form);
    const bio = formData.get("bio") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const avatarAlt = formData.get("avatarAlt") as string;
    const bannerUrl = formData.get("bannerUrl") as string;
    const bannerAlt = formData.get("bannerAlt") as string;

    const updates: Partial<Profile> = {};
    if (bio) updates.bio = bio;
    if (avatarUrl)
      updates.avatar = { url: avatarUrl, alt: avatarAlt || "Avatar" };
    if (bannerUrl)
      updates.banner = { url: bannerUrl, alt: bannerAlt || "Banner" };

    if (Object.keys(updates).length === 0) {
      errorEl.textContent = "Please provide at least one field to update.";
      return;
    }

    try {
      const updatedProfile = await updateProfile(currentUser.name, updates);

      const header = document.getElementById("profileHeader");
      if (header) header.innerHTML = profileCard(updatedProfile, false);

      initProfileCard();
      await updateNavMiniProfile();

      modal.close();
      modal.remove();
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      await showErrorModal(
        err?.message || "Failed to update profile. Please check the URLs."
      );
    }
  });

  modal.addEventListener("close", () => {
    modal.remove();
  });
}
