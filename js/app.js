function renderTourism() {
  const list = $("tourismList");
  const regionSelect = $("tourRegion");
  const searchInput = $("tourSearch");
  const categorySelect = $("tourCategory");
  const mapBox = $("tourismMap");
  if (!list || !regionSelect || !searchInput || !categorySelect) return;

  const regions = [...new Set(destinations.map((d) => d.region))];
  regionSelect.innerHTML =
    `<option value="all">All regions</option>` +
    regions.map((r) => `<option value="${r}">${r}</option>`).join("");

  let map;
  let markersLayer;

  if (mapBox && typeof L !== "undefined") {
    map = L.map("tourismMap").setView([-3.35, 29.9], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
  }

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const region = regionSelect.value;

    const filtered = destinations.filter((d) => {
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q);

      const matchCategory = category === "all" || d.category === category;
      const matchRegion = region === "all" || d.region === region;

      return matchQ && matchCategory && matchRegion;
    });

    list.innerHTML = filtered.length
      ? filtered.map((d) => {
        const zone = tourismZones.find((z) => z.id === d.zoneId);
        const overall = zone ? zoneScore(zone) : 0;

        return `
            <article class="card">
              <div class="cover">
                <img src="${esc(d.image)}" alt="${esc(d.name)}" />
              </div>
              <div class="card-body">
                <span class="badge">${esc(d.label)}</span>
                <h3 class="card-title">${esc(d.name)}</h3>
                <p class="card-text">${esc(d.description)}</p>
                <div style="height:10px"></div>
                <div class="muted">${esc(d.province)} • ${esc(d.region)}</div>
                <div style="height:10px"></div>
                ${scorePill(overall)}
                <a class="card-link" href="destination.html?id=${encodeURIComponent(d.id)}">Open details →</a>
              </div>
            </article>
          `;
      }).join("")
      : `<div class="empty">No destinations match your filters.</div>`;

    if (markersLayer) {
      markersLayer.clearLayers();
      filtered.forEach((d) => {
        const marker = L.marker([d.lat, d.lng]).addTo(markersLayer);
        marker.bindPopup(`
          <strong>${esc(d.name)}</strong><br />
          ${esc(d.label)} • ${esc(d.province)}<br />
          <a href="destination.html?id=${encodeURIComponent(d.id)}">Open details</a>
        `);
      });
    }
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
  regionSelect.addEventListener("change", applyFilters);
  applyFilters();
}