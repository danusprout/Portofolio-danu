export function smoothScroll(
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  targetId: string
) {
  e.preventDefault();
  const targetElement = document.getElementById(targetId);

  if (!targetElement && targetId === "top") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    history.pushState(null, "", "#top");
    return;
  }

  if (!targetElement) return;

  targetElement.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  // Update URL without page reload
  history.pushState(null, "", `#${targetId}`);
}
