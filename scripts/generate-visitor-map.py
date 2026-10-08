"""Generate the small, inline country map from public-domain Natural Earth data."""

import json
import math
import sys
import urllib.request
from pathlib import Path


SOURCE = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/"
    "geojson/ne_50m_admin_0_countries.geojson"
)
OUTPUT = Path(__file__).resolve().parents[1] / "src/assets/visitor-world-map.svg"


def point_to_segment_distance(point, start, end):
    dx, dy = end[0] - start[0], end[1] - start[1]
    if dx == 0 and dy == 0:
        return math.dist(point, start)
    position = max(
        0,
        min(
            1,
            ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy)
            / (dx * dx + dy * dy),
        ),
    )
    return math.dist(point, (start[0] + position * dx, start[1] + position * dy))


def simplify(points, tolerance=0.75):
    if len(points) <= 4:
        return points
    distance, index = max(
        (point_to_segment_distance(points[i], points[0], points[-1]), i)
        for i in range(1, len(points) - 1)
    )
    if distance <= tolerance:
        return [points[0], points[-1]]
    return simplify(points[: index + 1], tolerance)[:-1] + simplify(
        points[index:], tolerance
    )


def project(lon, lat):
    return round((lon + 180) * 2.5, 1), round((90 - lat) * 2.5, 1)


def ring_paths(ring):
    segments, segment, previous_lon = [], [], None
    for lon, lat, *_ in ring:
        if previous_lon is not None and abs(lon - previous_lon) > 180:
            if len(segment) >= 3:
                segments.append(segment)
            segment = []
        point = project(lon, lat)
        if not segment or point != segment[-1]:
            segment.append(point)
        previous_lon = lon
    if len(segment) >= 3:
        segments.append(segment)

    for original in segments:
        if original[0] == original[-1]:
            original = original[:-1]
        if len(original) < 3:
            continue
        points = simplify(original + [original[0]])[:-1]
        if len(points) < 3:
            points = original
        yield "M" + "L".join(f"{x:g},{y:g}" for x, y in points) + "Z"


def main():
    if len(sys.argv) > 1:
        countries = json.loads(Path(sys.argv[1]).read_text())["features"]
    else:
        with urllib.request.urlopen(SOURCE) as response:
            countries = json.load(response)["features"]

    paths = [
        '<svg viewBox="0 0 900 450" xmlns="http://www.w3.org/2000/svg" '
        'aria-hidden="true" focusable="false">'
    ]
    for country in countries:
        properties = country["properties"]
        code = properties.get("ISO_A2_EH") or properties.get("ISO_A2") or ""
        if len(code) != 2 or not code.isalpha():
            continue
        geometry = country["geometry"]
        polygons = (
            geometry["coordinates"]
            if geometry["type"] == "MultiPolygon"
            else [geometry["coordinates"]]
        )
        path = "".join(
            ring_path
            for polygon in polygons
            for ring in polygon
            for ring_path in ring_paths(ring)
        )
        if path:
            paths.append(f'<path data-country="{code}" d="{path}"/>')
    paths.append("</svg>")
    OUTPUT.write_text("\n".join(paths) + "\n")
    print(f"Wrote {OUTPUT} with {len(paths) - 2} countries")


if __name__ == "__main__":
    main()
