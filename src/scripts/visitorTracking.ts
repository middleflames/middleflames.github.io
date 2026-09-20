type Counts = Record<string, string | number>;

let pendingRequest: AbortController | undefined;

async function countVisit(): Promise<void> {
  pendingRequest?.abort();

  // Preview and local development should not alter the public site's counts.
  if (location.hostname !== "middleflames.github.io") return;

  const request = new AbortController();
  pendingRequest = request;
  const pageUrl = location.href;

  try {
    const response = await fetch("https://cdn.busuanzi.cc/api.php", {
      method: "POST",
      body: JSON.stringify({ url: pageUrl, referrer: document.referrer }),
      signal: request.signal,
    });
    if (!response.ok) throw new Error(`Visitor counter: ${response.status}`);

    const counts = (await response.json()) as Counts;
    if (location.href !== pageUrl) return;

    for (const id of ["busuanzi_site_uv", "busuanzi_page_pv"]) {
      const value = counts[id];
      if (typeof value !== "string" && typeof value !== "number") continue;
      document.getElementById(id)?.replaceChildren(String(value));
    }
  } catch {
    // Leave the placeholder when the external counter is unavailable.
    return;
  }
}

document.addEventListener("astro:page-load", countVisit);
