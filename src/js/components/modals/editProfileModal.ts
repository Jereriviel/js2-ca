import { getUser } from "../../store/userStore";
import { getProfile, updateProfile } from "../../services/profileService";
import { profileCard, initProfileCard } from "../profileCard";
import type { Profile } from "../../types/profile";
import { updateNavMiniProfile } from "../navigation";
import { showErrorModal } from "../modals/errorModal";
import { createModal } from "../../utils/createModal";
import { inputModal, textArea } from "../inputs";

export async function openEditProfileModal() {
  const currentUser = getUser();
  if (!currentUser) return;

  const profile: Profile = await getProfile(currentUser.name);

  const existingModal = document.querySelector<HTMLDialogElement>(
    ".edit-profile-modal"
  );
  if (existingModal) existingModal.remove();

  const modal = createModal(`
    <form
    method="dialog"
    class="edit-profile-form min-w-[375px] flex flex-col gap-4">
      <h2 class="font-semibold text-xl">Edit Profile</h2>
      <div class="flex flex-col gap-4">
      ${textArea({
        type: "text",
        name: "bio",
        placeholder: "Your bio",
        label: "Bio",
        id: "bio",
        required: false,
      }).replace("></textarea>", `>${profile.bio ?? ""}</textarea>`)}  

      ${inputModal({
        type: "url",
        name: "avatarUrl",
        placeholder: "https://...",
        label: "Profile image URL",
        id: "avatarUrl",
        required: false,
      }).replace('value=""', `value="${profile.avatar?.url ?? ""}"`)}

      ${inputModal({
        type: "text",
        name: "avatarAlt",
        placeholder: "Profile image alt text",
        label: "Avatar Alt",
        id: "avatarAlt",
        required: false,
      }).replace('value=""', `value="${profile.avatar?.alt ?? ""}"`)}

      ${inputModal({
        type: "url",
        name: "bannerUrl",
        placeholder: "https://...",
        label: "Profile banner URL",
        id: "bannerUrl",
        required: false,
      }).replace('value=""', `value="${profile.banner?.url ?? ""}"`)}

      ${inputModal({
        type: "text",
        name: "bannerAlt",
        placeholder: "Profile banner alt text",
        label: "Banner Alt",
        id: "bannerAlt",
        required: false,
      }).replace('value=""', `value="${profile.banner?.alt ?? ""}"`)}
      </div>
      <div class="modal-actions flex justify-between">
        <button type="button" id="cancelBtn" class="font-medium hover:bg-gray-medium w-fit py-4 px-5 rounded-full mt-4">Cancel</button>
        <button type="submit" class="bg-primary hover:bg-primary-hover text-white text- w-fit py-4 px-5 rounded-full mt-4">Save</button>
      </div>
      <p class="error-message"></p>
    </form>
  `);

  document.body.appendChild(modal);
  modal.showModal();

  const form = modal.querySelector<HTMLFormElement>("form.edit-profile-form")!;
  const cancelBtn = form.querySelector<HTMLButtonElement>("#cancelBtn")!;
  const errorEl = form.querySelector<HTMLParagraphElement>(".error-message")!;

  form.querySelector<HTMLTextAreaElement>("#bio")!.value = profile.bio || "";
  form.querySelector<HTMLInputElement>("#avatarUrl")!.value =
    profile.avatar?.url || "";
  form.querySelector<HTMLInputElement>("#avatarAlt")!.value =
    profile.avatar?.alt || "";
  form.querySelector<HTMLInputElement>("#bannerUrl")!.value =
    profile.banner?.url || "";
  form.querySelector<HTMLInputElement>("#bannerAlt")!.value =
    profile.banner?.alt || "";

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
