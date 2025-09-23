export function showErrorModal(message: string): Promise<void> {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal">
        <p>${message}</p>
        <button id="errorOkBtn">OK</button>
      </div>
    `;

    document.body.appendChild(modal);

    const okBtn = modal.querySelector<HTMLButtonElement>("#errorOkBtn")!;
    okBtn.addEventListener("click", () => {
      modal.remove();
      resolve();
    });
  });
}
