const mapScriptUrl =
  "https://feed-pulse.com/api/embed/visitor-globe.js?site_id=f9c18aeb-0402-497d-9ae5-7b826837021c&map=globe&sz=md&theme=obsidian&speed=normal";

document.addEventListener("astro:page-load", () => {
  const map = document.querySelector<HTMLElement>("[data-visitor-map]");
  if (!map || map.querySelector("script")) return;

  const script = document.createElement("script");
  script.src = mapScriptUrl;
  script.async = true;
  script.onerror = () => {
    map.replaceChildren("The visitor map is unavailable right now.");
  };
  map.append(script);
});
