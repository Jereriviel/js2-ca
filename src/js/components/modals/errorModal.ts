import { createModal } from "../../utils/createModal";

export function showErrorModal(message: string): Promise<void> {
  return new Promise((resolve) => {
    const modal = createModal(`
      <div class="flex flex-col gap-4 w-full min-w-[300px]">
        <p class="text-lg">${message}</p>
        <button id="errorOkBtn" class="bg-primary hover:bg-primary-hover text-white py-3 px-5 rounded-full w-fit self-end">OK</button>
      </div>
    `);

    document.body.appendChild(modal);
    modal.showModal();

    const okBtn = modal.querySelector<HTMLButtonElement>("#errorOkBtn")!;
    okBtn.addEventListener("click", () => modal.close());

    modal.addEventListener("close", () => {
      modal.remove();
      resolve();
    });
  });
}
