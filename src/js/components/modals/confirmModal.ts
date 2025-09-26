import { createModal } from "../../utils/createModal";

export function showConfirmModal(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = createModal(`
      <div class="flex flex-col gap-4 w-full min-w-[300px]">
        <p class="text-lg">${message}</p>
        <div class="flex justify-between gap-2 mt-4">
          <button id="cancelBtn" class="font-medium hover:bg-gray-medium w-fit py-4 px-5 rounded-full mt-4">Cancel</button>
          <button id="confirmBtn" class="bg-red-500 hover:bg-red-700 text-white text- w-fit py-4 px-5 rounded-full mt-4">Yes, delete</button>
        </div>
      </div>
    `);

    document.body.appendChild(modal);
    modal.showModal();

    const confirmBtn = modal.querySelector<HTMLButtonElement>("#confirmBtn")!;
    const cancelBtn = modal.querySelector<HTMLButtonElement>("#cancelBtn")!;

    confirmBtn.addEventListener("click", () => {
      modal.close();
      resolve(true);
    });

    cancelBtn.addEventListener("click", () => {
      modal.close();
      resolve(false);
    });

    modal.addEventListener("close", () => {
      modal.remove();
    });
  });
}
