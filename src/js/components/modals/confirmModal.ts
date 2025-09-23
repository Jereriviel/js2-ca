export function showConfirmModal(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal">
        <p>${message}</p>
        <button id="confirmYesBtn">Yes, delete</button>
        <button id="confirmCancelBtn">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    const yesBtn = modal.querySelector<HTMLButtonElement>("#confirmYesBtn")!;
    const cancelBtn =
      modal.querySelector<HTMLButtonElement>("#confirmCancelBtn")!;

    yesBtn.addEventListener("click", () => {
      modal.remove();
      resolve(true);
    });

    cancelBtn.addEventListener("click", () => {
      modal.remove();
      resolve(false);
    });
  });
}
