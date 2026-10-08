const siteId = "f9c18aeb-0402-497d-9ae5-7b826837021c";
let themeObserver: MutationObserver | undefined;

function getSessionId(): string {
  const key = "visitor-map-session";
  try {
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = Math.random().toString(36).slice(2, 14);
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2, 14);
  }
}

async function recordVisit(): Promise<void> {
  // The map widget only reads location data; a separate request records visits.
  // Match the traffic widget's payload and avoid counting local previews.
  if (location.hostname !== "middleflames.github.io") return;

  try {
    await fetch(`https://feed-pulse.com/api/track/${siteId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referrer: document.referrer || "direct",
        landing_page: location.pathname || "/",
        title: document.title.slice(0, 160),
        host: location.host,
        session_id: getSessionId(),
      }),
      keepalive: true,
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Keep the map available even if the analytics service is unreachable.
  }
}

document.addEventListener("astro:page-load", () => {
  // Continue recording sitewide visits even though the map has its own page.
  void recordVisit();

  themeObserver?.disconnect();
  const map = document.querySelector<HTMLIFrameElement>("[data-visitor-map]");
  const frameUrl = map?.dataset.frameUrl;
  if (!map || !frameUrl) return;
  const frame = map;
  const sourceUrl = frameUrl;

  function updateMapTheme(): void {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    if (frame.dataset.theme === theme) return;

    const url = new URL(sourceUrl, location.href);
    url.searchParams.set("theme", theme);
    frame.src = url.href;
    frame.dataset.theme = theme;
  }

  updateMapTheme();
  themeObserver = new MutationObserver(updateMapTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});
