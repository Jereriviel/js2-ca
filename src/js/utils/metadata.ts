export function updateMetadata(title: string, description: string) {
  document.title = title;

  let metaDescriptionTag = document.querySelector('meta[name="description"]');
  if (!metaDescriptionTag) {
    metaDescriptionTag = document.createElement("meta");
    metaDescriptionTag.setAttribute("name", "description");
    document.head.appendChild(metaDescriptionTag);
  }
  metaDescriptionTag.setAttribute("content", description);
}
