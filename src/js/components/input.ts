export function input(props: InputProps): string {
  return `
     <div class="flex flex-col gap-2">
          <label for="${props.id}" class="font-medium">${
    props.label || ""
  }</label>
          <input
            id="${props.id}"
            type="${props.type || "text"}"
            name="${props.name}"
            ${props.required ? "required" : ""}
            ${props.minlength ? `minlength="${props.minlength}"` : ""}
            placeholder="${props.placeholder || ""}"
            class="px-4 py-3 w-[300px] rounded-full bg-gray-light border border-gray-medium"
          />
        </div>`;
}

interface InputProps {
  type?: "text" | "email" | "password";
  name: string;
  required?: boolean;
  placeholder?: string;
  label?: string;
  minlength?: number;
  id?: string;
}
