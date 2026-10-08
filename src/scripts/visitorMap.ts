const siteId = "f9c18aeb-0402-497d-9ae5-7b826837021c";

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
    const response = await fetch(`https://feed-pulse.com/api/track/${siteId}`, {
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
    if (response.ok)
      document.dispatchEvent(new Event("feedpulse:visit-recorded"));
  } catch {
    // Keep the site available even if the analytics service is unreachable.
  }
}

document.addEventListener("astro:page-load", () => {
  void recordVisit();
});
