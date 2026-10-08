type Country = {
  country_code: string;
  country_name: string;
  country_flag: string;
  count: number;
};

type VisitorHistory = {
  countries?: Country[];
};

const siteId = "f9c18aeb-0402-497d-9ae5-7b826837021c";
let pendingRequest: AbortController | undefined;

function countryRow(country: Country): HTMLLIElement {
  const row = document.createElement("li");
  row.className = "flex items-center justify-between gap-3";

  const name = document.createElement("span");
  name.className = "min-w-0 truncate";
  name.textContent =
    country.country_code === "XX"
      ? "🌐 Unknown location"
      : `${country.country_flag || "🌐"} ${country.country_name || country.country_code}`;

  const count = document.createElement("strong");
  count.className = "tabular-nums";
  count.textContent = country.count.toLocaleString();

  row.append(name, count);
  return row;
}

async function loadHistory(): Promise<void> {
  pendingRequest?.abort();

  const list = document.querySelector<HTMLUListElement>(
    "[data-visitor-countries]"
  );
  const total = document.querySelector<HTMLElement>("[data-located-visits]");
  const status = document.querySelector<HTMLElement>(
    "[data-visitor-history-status]"
  );
  const map = document.querySelector<HTMLElement>(".visitor-world-map");
  if (!list || !total || !status || !map) return;

  const request = new AbortController();
  pendingRequest = request;

  try {
    const response = await fetch(
      `https://feed-pulse.com/api/widget/flags/${siteId}?include_bots=0`,
      { cache: "no-store", signal: request.signal }
    );
    if (!response.ok) throw new Error(`Visitor history: ${response.status}`);
    const history = (await response.json()) as VisitorHistory;
    if (!Array.isArray(history.countries)) throw new Error("Invalid history");
    if (request.signal.aborted) return;

    const countries = history.countries
      .filter(
        country =>
          /^[A-Z]{2}$/.test(country.country_code) &&
          Number.isFinite(country.count) &&
          country.count > 0
      )
      .sort((a, b) => b.count - a.count);
    const located = countries.filter(country => country.country_code !== "XX");
    const unknown = countries.filter(country => country.country_code === "XX");
    const locatedVisits = located.reduce(
      (sum, country) => sum + country.count,
      0
    );
    const largestCount = Math.max(1, ...located.map(country => country.count));

    map.querySelectorAll<SVGPathElement>("path[data-country]").forEach(path => {
      path.removeAttribute("data-level");
      path.querySelector("title")?.remove();
    });
    for (const country of located) {
      const path = map.querySelector<SVGPathElement>(
        `path[data-country="${country.country_code}"]`
      );
      if (!path) continue;
      path.dataset.level = String(
        Math.max(
          1,
          Math.ceil((4 * Math.log1p(country.count)) / Math.log1p(largestCount))
        )
      );
      const title = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "title"
      );
      title.textContent = `${country.country_name}: ${country.count.toLocaleString()} visits`;
      path.append(title);
    }

    total.textContent = locatedVisits.toLocaleString();
    list.replaceChildren(...[...located, ...unknown].map(countryRow));
    if (countries.length === 0) {
      const empty = document.createElement("li");
      empty.className = "text-muted-foreground";
      empty.textContent = "No visits recorded yet.";
      list.append(empty);
    }
    status.textContent =
      "Stronger map colors show countries with more recorded visits.";
  } catch {
    if (request.signal.aborted) return;
    list.replaceChildren("Location history is unavailable right now.");
    status.textContent = "";
  }
}

document.addEventListener("astro:page-load", () => void loadHistory());
document.addEventListener("feedpulse:visit-recorded", () => void loadHistory());

export {};
