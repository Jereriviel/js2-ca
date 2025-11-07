export function input(props: InputProps): string {
  return `
    <div class="flex flex-col gap-2 w-fit">
      <label for="${props.id}" class="font-medium">
        ${props.label || ""}
      </label>
      <input
        id="${props.id}"
        type="${props.type || "text"}"
        name="${props.name}"
        ${props.required ? "required" : ""}
        ${props.minlength ? `minlength="${props.minlength}"` : ""}
        placeholder="${props.placeholder || ""}"
        class="px-4 py-3 w-[300px] rounded-full bg-gray-light border border-gray-medium focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
      />
      <p id="${props.id}Error" class="text-red-500 text-sm hidden"></p>
    </div>
  `;
}

export function inputModal(props: InputProps): string {
  return `
    <div class="flex flex-col gap-2">
      <label for="${props.id}" class="font-medium">
        ${props.label || ""}
      </label>
      <input
        id="${props.id}"
        type="${props.type || "text"}"
        name="${props.name}"
        ${props.required ? "required" : ""}
        ${props.minlength ? `minlength="${props.minlength}"` : ""}
        placeholder="${props.placeholder || ""}"
        class="border border-gray-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
      />
      <p id="${props.id}Error" class="text-red-500 text-sm hidden"></p>
    </div>
  `;
}

export function textArea(props: InputProps): string {
  return `
    <div class="flex flex-col gap-2">
      <label for="${props.id}" class="font-medium text-lg">
        ${props.label || ""}
      </label>
      <textarea
        id="${props.id}"
        name="${props.name}"
        ${props.required ? "required" : ""}
        ${props.minlength ? `minlength="${props.minlength}"` : ""}
        placeholder="${props.placeholder || ""}"
        class="min-h-25 border border-gray-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
      ></textarea>
      <p id="${props.id}Error" class="text-red-500 text-sm hidden"></p>
    </div>
  `;
}

interface InputProps {
  type?: "text" | "email" | "password" | "url";
  name: string;
  required?: boolean;
  placeholder?: string;
  label?: string;
  minlength?: number;
  id?: string;
}
