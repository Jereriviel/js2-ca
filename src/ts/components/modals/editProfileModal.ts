import { getUser } from "../../store/userStore";
import { getProfile, updateProfile } from "../../services/profileService";
import { profileCard } from "../profileCard";
import type { Profile } from "../../types/profile";
import { loadNavMiniProfile } from "../navigation";
import { showErrorModal } from "./errorModal";
import { createModal } from "../../utils/createModal";
import { inputModal, textArea } from "../inputs";
import { handleError } from "../../errors/handleError";

export async function openEditProfileModal() {
  const currentUser = getUser();
  if (!currentUser) return;

  let profile: Profile;

  try {
    profile = await getProfile(currentUser.name);
  } catch (error) {
    await showErrorModal(handleError(error));
    return;
  }

  const existingModal = document.querySelector<HTMLDialogElement>(
    ".edit-profile-modal",
  );
  if (existingModal) existingModal.remove();

  const modal = createModal("");

  const form = document.createElement("form");
  form.method = "dialog";
  form.className = "edit-profile-form min-w-[375px] flex flex-col gap-4";

  const title = document.createElement("h2");
  title.className = "font-semibold text-xl";
  title.textContent = "Edit Profile";

  const fields = document.createElement("div");
  fields.className = "flex flex-col gap-4";

  fields.innerHTML = `
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
  `;

  const actions = document.createElement("div");
  actions.className = "modal-actions flex justify-between";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.id = "cancelBtn";
  cancelBtn.className =
    "font-medium hover:bg-gray-medium w-fit py-2 px-5 rounded-full mt-4";
  cancelBtn.textContent = "Cancel";

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className =
    "bg-primary hover:bg-primary-hover text-white w-fit py-2 px-5 rounded-full mt-4";
  saveBtn.textContent = "Save";

  const errorEl = document.createElement("p");
  errorEl.className = "error-message text-red-500 text-sm";

  actions.append(cancelBtn, saveBtn);

  form.append(title, fields, actions, errorEl);
  modal.appendChild(form);

  document.body.appendChild(modal);
  modal.showModal();

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

    if (avatarUrl) {
      updates.avatar = {
        url: avatarUrl,
        alt: avatarAlt || "Avatar",
      };
    }

    if (bannerUrl) {
      updates.banner = {
        url: bannerUrl,
        alt: bannerAlt || "Banner",
      };
    }

    if (Object.keys(updates).length === 0) {
      errorEl.textContent = "Please provide at least one field to update.";
      return;
    }

    try {
      const updatedProfile = await updateProfile(currentUser.name, updates);

      const header = document.getElementById("profileHeader");

      if (header) {
        const newHeader = profileCard(updatedProfile, false);
        header.replaceWith(newHeader);
      }

      await loadNavMiniProfile();

      modal.close();
      modal.remove();
    } catch (error) {
      await showErrorModal(handleError(error));
    }
  });

  modal.addEventListener("close", () => {
    modal.remove();
  });
}
