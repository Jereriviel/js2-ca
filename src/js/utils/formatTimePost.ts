export function formatTimePost(dateString: string): string {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
