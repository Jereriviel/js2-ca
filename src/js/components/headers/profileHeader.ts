import { profileCard } from "../profileCard";

export function profileHeader(): string {
  return `
     <div id="profileHeader">
        ${profileCard}
    </div>
`;
}
