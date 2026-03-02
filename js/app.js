function $(id) {
  return document.getElementById(id);
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function zoneScore(zone) {
  return average([
    zone.road,
    zone.transport,
    zone.ict,
    zone.electricity,
    zone.water,
    zone.accommodation
  ]);
}

function scorePill(score) {
  if (score >= 75) return `<span class="pill ok">${score}/100 • Good</span>`;
  if (score >= 50) return `<span class="pill warn">${score}/100 • Medium</span>`;
  return `<span class="pill bad">${score}/100 • Low</span>`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function esc(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function seedAppData() {
  seedLS("jobs", seedJobs);
  seedLS("services", seedServices);
  seedLS("inquiries", []);
}

function setActiveNav() {
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === page) a.classList.add("active");
  });
}

function setupNavToggle() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("siteNav");
  if (!btn || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? "✕ Close" : "☰ Menu";
  };

  btn.addEventListener("click", () => {
    setOpen(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) setOpen(false);
  });
}

/* ---------- Tourism ---------- */
function renderTourism() {
  const list = $("tourismList");
  const regionSelect = $("tourRegion");
  const searchInput = $("tourSearch");
  const categorySelect = $("tourCategory");
  const mapBox = $("tourismMap");
  if (!list || !regionSelect || !searchInput || !categorySelect) return;

  const regions = [...new Set(destinations.map((d) => d.region))];
  regionSelect.innerHTML = `<option value="all">All regions</option>` +
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

function renderDestination() {
  const box = $("destinationDetails");
  const mapBox = $("destinationMap");
  if (!box) return;

  const id = getQueryParam("id");
  const d = destinations.find((item) => item.id === id);

  if (!d) {
    box.innerHTML = `<div class="empty">Destination not found.</div>`;
    return;
  }

  const zone = tourismZones.find((z) => z.id === d.zoneId);
  const overall = zone ? zoneScore(zone) : 0;
  const related = investmentOpportunities.filter((item) => item.zoneId === d.zoneId);

  box.innerHTML = `
    <div class="grid-2">
      <article class="card">
        <div class="cover" style="height:280px">
          <img src="${esc(d.image)}" alt="${esc(d.name)}" />
        </div>
        <div class="card-body">
          <span class="badge">${esc(d.label)}</span>
          <h2 style="margin:10px 0 6px">${esc(d.name)}</h2>
          <p class="muted">${esc(d.province)} • ${esc(d.region)}</p>
          <p>${esc(d.description)}</p>
          <h3>Available local services</h3>
          <ul>
            ${d.services.map((s) => `<li>${esc(s)}</li>`).join("")}
          </ul>
        </div>
      </article>

      <article class="card">
        <div class="card-body">
          <h3 style="margin-top:0">Infrastructure readiness</h3>
          ${zone ? `
            <div class="kpi-row">
              <div class="stat"><strong>${zone.road}</strong><span>Roads</span></div>
              <div class="stat"><strong>${zone.transport}</strong><span>Transport</span></div>
              <div class="stat"><strong>${zone.ict}</strong><span>ICT</span></div>
              <div class="stat"><strong>${zone.electricity}</strong><span>Power</span></div>
            </div>
            <div style="height:12px"></div>
            ${scorePill(overall)}
            <p><strong>Key gap:</strong> ${esc(zone.keyGap)}</p>
            <p><strong>Recommendation:</strong> ${esc(zone.recommendation)}</p>
          ` : `<p class="muted">No zone data available.</p>`}

          <h3>Nearby investment opportunities</h3>
          ${related.length
      ? related.map((item) => `
                <div class="mini-card">
                  <strong>${esc(item.title)}</strong>
                  <div class="muted">${esc(item.sector)} • ${esc(item.budget)}</div>
                  <p>${esc(item.summary)}</p>
                </div>
              `).join("")
      : `<p class="muted">No linked opportunities yet.</p>`
    }

          <a class="btn btn-secondary" href="tourism.html">← Back to tourism</a>
        </div>
      </article>
    </div>
  `;

  if (mapBox && typeof L !== "undefined") {
    const map = L.map("destinationMap").setView([d.lat, d.lng], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    L.marker([d.lat, d.lng]).addTo(map).bindPopup(d.name).openPopup();
  }
}

/* ---------- Infrastructure ---------- */
function exportZone(zoneId) {
  const zone = tourismZones.find((z) => z.id === zoneId);
  if (!zone) return;

  const text = [
    "SIT BURUNDI - READINESS REPORT",
    "-------------------------------",
    `Zone: ${zone.name}`,
    `Overall: ${zoneScore(zone)}/100`,
    `Roads: ${zone.road}`,
    `Transport: ${zone.transport}`,
    `ICT: ${zone.ict}`,
    `Electricity: ${zone.electricity}`,
    `Water: ${zone.water}`,
    `Accommodation: ${zone.accommodation}`,
    `Key Gap: ${zone.keyGap}`,
    `Recommendation: ${zone.recommendation}`
  ].join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${zone.id}-readiness-report.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderInfrastructure() {
  const box = $("zones");
  if (!box) return;

  box.innerHTML = `
    <div class="grid-4">
      ${tourismZones.map((z) => `
        <div class="card">
          <div class="card-body">
            <span class="badge">📍 ${esc(z.name)}</span>
            <h3 class="card-title" style="margin-top:10px">${zoneScore(z)}/100</h3>
            <p class="card-text"><strong>Key gap:</strong> ${esc(z.keyGap)}</p>
            <p class="card-text">${esc(z.recommendation)}</p>
          </div>
        </div>
      `).join("")}
    </div>

    <div style="height:18px"></div>

    <table class="table">
      <thead>
        <tr>
          <th>Zone</th>
          <th>Overall</th>
          <th>Roads</th>
          <th>ICT</th>
          <th>Power</th>
          <th>Export</th>
        </tr>
      </thead>
      <tbody>
        ${tourismZones.map((z) => `
          <tr>
            <td><strong>${esc(z.name)}</strong></td>
            <td>${scorePill(zoneScore(z))}</td>
            <td>${z.road}/100</td>
            <td>${z.ict}/100</td>
            <td>${z.electricity}/100</td>
            <td>
              <button class="btn btn-secondary btn-small" data-export-zone="${z.id}" ${!isAdmin() ? "disabled" : ""}>
                Export
              </button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    ${!isAdmin() ? `<div class="notice">Login as Admin to export detailed reports.</div>` : ""}
  `;

  box.querySelectorAll("[data-export-zone]").forEach((btn) => {
    btn.addEventListener("click", () => exportZone(btn.dataset.exportZone));
  });
}

/* ---------- Investment ---------- */
function getInquiries() {
  return readLS("inquiries", []);
}

function saveInquiries(items) {
  writeLS("inquiries", items);
}

function renderInvestment() {
  const box = $("investmentBox");
  if (!box) return;

  const user = getSession();

  box.innerHTML = `
    <div class="grid-2">
      ${investmentOpportunities.map((item) => `
        <article class="card">
          <div class="card-body">
            <span class="badge red">💼 ${esc(item.sector)}</span>
            <h3 class="card-title" style="margin-top:10px">${esc(item.title)}</h3>
            <p class="muted">${esc(item.location)} • ${esc(item.budget)}</p>
            <p>${esc(item.summary)}</p>
            <p><strong>Impact:</strong> ${esc(item.expectedImpact)}</p>
            <p><strong>ROI:</strong> ${esc(item.roi)}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  if (!user) {
    box.innerHTML += `<div class="notice">Login as an Investor to submit an inquiry.</div>`;
    return;
  }

  if (!["Investor", "Admin"].includes(user.role)) {
    box.innerHTML += `<div class="notice">You are logged in as ${user.role}. Only Investors can submit inquiries.</div>`;
    return;
  }

  box.innerHTML += `
    <div style="height:20px"></div>
    <div class="card">
      <div class="card-body">
        <h3 style="margin-top:0">Submit an investment inquiry</h3>
        <form id="inquiryForm" class="form-grid">
          <select id="inqOpportunity" class="select" required>
            <option value="">Choose an opportunity</option>
            ${investmentOpportunities.map((i) => `<option value="${i.id}">${i.title}</option>`).join("")}
          </select>
          <select id="inqZone" class="select" required>
            <option value="">Choose a target zone</option>
            ${tourismZones.map((z) => `<option value="${z.id}">${z.name}</option>`).join("")}
          </select>
          <textarea id="inqMessage" class="textarea" required placeholder="Write your proposal or interest..."></textarea>
          <button class="btn btn-primary" type="submit">Submit inquiry</button>
        </form>
      </div>
    </div>
  `;

  const form = $("inquiryForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const items = getInquiries();
    const opportunity = investmentOpportunities.find((i) => i.id === $("inqOpportunity").value);
    const zone = tourismZones.find((z) => z.id === $("inqZone").value);

    items.unshift({
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      investorName: user.name,
      investorEmail: user.email,
      opportunityId: opportunity?.id || "",
      opportunityTitle: opportunity?.title || "",
      zoneId: zone?.id || "",
      zoneName: zone?.name || "",
      message: $("inqMessage").value.trim()
    });

    saveInquiries(items);
    form.reset();
    alert("Inquiry submitted successfully.");
  });
}

/* ---------- Community ---------- */
function getServices() {
  return readLS("services", []);
}

function saveServices(items) {
  writeLS("services", items);
}

function getJobs() {
  return readLS("jobs", []);
}

function saveJobs(items) {
  writeLS("jobs", items);
}

function renderCommunity() {
  const box = $("communityBox");
  if (!box) return;

  const user = getSession();
  const services = getServices().filter((s) => s.status === "Approved");
  const jobs = getJobs();

  box.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-body">
          <span class="badge">🧩 Local services</span>
          <div style="height:12px"></div>
          ${services.length
      ? services.map((s) => `
                <div class="mini-card">
                  <strong>${esc(s.businessName)}</strong>
                  <div class="muted">${esc(s.category)} • ${esc(s.location)}</div>
                  <p>${esc(s.description)}</p>
                  <div class="muted">Contact: ${esc(s.contact)}</div>
                </div>
              `).join("")
      : `<div class="empty">No approved services yet.</div>`
    }
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <span class="badge">💼 Jobs</span>
          <div style="height:12px"></div>
          ${jobs.length
      ? jobs.map((j) => `
                <div class="mini-card">
                  <strong>${esc(j.title)}</strong>
                  <div class="muted">${esc(j.company)} • ${esc(j.location)} • ${esc(j.type)}</div>
                  <p>${esc(j.description)}</p>
                  <button class="btn btn-secondary btn-small" type="button" data-apply="${esc(j.applyContact)}">Apply</button>
                </div>
              `).join("")
      : `<div class="empty">No jobs posted yet.</div>`
    }
        </div>
      </div>
    </div>
  `;

  box.querySelectorAll("[data-apply]").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(`Apply using: ${btn.dataset.apply}`);
    });
  });

  if (!user) {
    box.innerHTML += `<div class="notice">Login as a Community user to submit your business.</div>`;
    return;
  }

  if (["Community", "Admin"].includes(user.role)) {
    box.innerHTML += `
      <div style="height:20px"></div>
      <div class="card">
        <div class="card-body">
          <h3 style="margin-top:0">Register your local service</h3>
          <form id="serviceForm" class="form-grid">
            <input id="svcName" class="input" required placeholder="Business name" />
            <select id="svcCategory" class="select" required>
              <option value="">Choose category</option>
              <option>Guiding</option>
              <option>Transport</option>
              <option>Accommodation</option>
              <option>Food & Restaurant</option>
              <option>Arts & Crafts</option>
            </select>
            <input id="svcLocation" class="input" required placeholder="Location" />
            <input id="svcContact" class="input" required placeholder="Phone or email" />
            <textarea id="svcDesc" class="textarea" required placeholder="Describe your service..."></textarea>
            <button class="btn btn-primary" type="submit">Submit for approval</button>
          </form>
        </div>
      </div>
    `;

    $("serviceForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const items = getServices();
      items.unshift({
        id: `svc-${Date.now()}`,
        ownerName: user.name,
        ownerEmail: user.email,
        businessName: $("svcName").value.trim(),
        category: $("svcCategory").value,
        location: $("svcLocation").value.trim(),
        description: $("svcDesc").value.trim(),
        contact: $("svcContact").value.trim(),
        status: "Pending",
        createdAt: new Date().toISOString()
      });
      saveServices(items);
      alert("Service submitted. It will appear after Admin approval.");
      $("serviceForm").reset();
    });
  }

  if (user.role === "Admin") {
    box.innerHTML += `
      <div style="height:20px"></div>
      <div class="card">
        <div class="card-body">
          <h3 style="margin-top:0">[Admin] Post a job</h3>
          <form id="jobForm" class="form-grid">
            <input id="jobTitle" class="input" required placeholder="Job title" />
            <input id="jobCompany" class="input" required placeholder="Company" />
            <input id="jobLocation" class="input" required placeholder="Location" />
            <select id="jobType" class="select" required>
              <option value="">Choose type</option>
              <option>Internship</option>
              <option>Part-time</option>
              <option>Full-time</option>
              <option>Contract</option>
            </select>
            <input id="jobApply" class="input" required placeholder="Apply contact" />
            <textarea id="jobDesc" class="textarea" required placeholder="Job description..."></textarea>
            <button class="btn btn-primary" type="submit">Post job</button>
          </form>
        </div>
      </div>
    `;

    $("jobForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const items = getJobs();
      items.unshift({
        id: `job-${Date.now()}`,
        title: $("jobTitle").value.trim(),
        company: $("jobCompany").value.trim(),
        location: $("jobLocation").value.trim(),
        type: $("jobType").value,
        description: $("jobDesc").value.trim(),
        applyContact: $("jobApply").value.trim(),
        createdAt: new Date().toISOString()
      });
      saveJobs(items);
      alert("Job posted.");
      $("jobForm").reset();
    });
  }
}

/* ---------- Admin ---------- */
function setInquiryStatus(id, status) {
  const items = getInquiries();
  const target = items.find((x) => x.id === id);
  if (!target) return;
  target.status = status;
  saveInquiries(items);
  renderAdmin();
}

function setServiceStatus(id, status) {
  const items = getServices();
  const target = items.find((x) => x.id === id);
  if (!target) return;
  target.status = status;
  saveServices(items);
  renderAdmin();
}

function deleteJob(id) {
  const items = getJobs().filter((x) => x.id !== id);
  saveJobs(items);
  renderAdmin();
}

function renderAdmin() {
  const stats = $("adminStats");
  const inqBox = $("adminInquiries");
  const svcBox = $("adminServices");
  const jobBox = $("adminJobs");
  if (!inqBox || !svcBox || !jobBox) return;

  const user = requireAuth(["Admin"]);
  if (!user) return;

  const inquiries = getInquiries();
  const services = getServices();
  const jobs = getJobs();

  if (stats) {
    stats.innerHTML = `
      <div class="grid-4">
        <div class="card"><div class="card-body"><span class="badge">📩 Inquiries</span><h3 class="card-title">${inquiries.filter((i) => i.status === "Pending").length} Pending</h3></div></div>
        <div class="card"><div class="card-body"><span class="badge">✅ Services</span><h3 class="card-title">${services.filter((s) => s.status === "Pending").length} Pending</h3></div></div>
        <div class="card"><div class="card-body"><span class="badge">💼 Jobs</span><h3 class="card-title">${jobs.length} Active</h3></div></div>
        <div class="card"><div class="card-body"><span class="badge">🗺️ Zones</span><h3 class="card-title">${tourismZones.length} Tracked</h3></div></div>
      </div>
    `;
  }

  inqBox.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Investor</th>
          <th>Opportunity</th>
          <th>Zone</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${inquiries.length
      ? inquiries.map((i) => `
              <tr>
                <td>${new Date(i.createdAt).toLocaleDateString()}</td>
                <td><strong>${esc(i.investorName)}</strong><br><span class="muted">${esc(i.investorEmail)}</span></td>
                <td>${esc(i.opportunityTitle)}</td>
                <td>${esc(i.zoneName)}</td>
                <td>${scorePill(i.status === "Pending" ? 60 : 80)}</td>
                <td>
                  <button class="btn btn-secondary btn-small" data-read="${i.id}">Mark read</button>
                </td>
              </tr>
            `).join("")
      : `<tr><td colspan="6"><div class="empty">No inquiries yet.</div></td></tr>`
    }
      </tbody>
    </table>
  `;

  svcBox.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Business</th>
          <th>Owner</th>
          <th>Category</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${services.length
      ? services.map((s) => `
              <tr>
                <td>${esc(s.businessName)}</td>
                <td>${esc(s.ownerName)}</td>
                <td>${esc(s.category)}</td>
                <td>${esc(s.location)}</td>
                <td>${esc(s.status)}</td>
                <td class="actions">
                  <button class="btn btn-secondary btn-small" data-approve="${s.id}">Approve</button>
                  <button class="btn btn-secondary btn-small danger" data-reject="${s.id}">Reject</button>
                </td>
              </tr>
            `).join("")
      : `<tr><td colspan="6"><div class="empty">No service submissions yet.</div></td></tr>`
    }
      </tbody>
    </table>
  `;

  jobBox.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Job</th>
          <th>Company</th>
          <th>Type</th>
          <th>Location</th>
          <th>Posted</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${jobs.length
      ? jobs.map((j) => `
              <tr>
                <td>${esc(j.title)}</td>
                <td>${esc(j.company)}</td>
                <td>${esc(j.type)}</td>
                <td>${esc(j.location)}</td>
                <td>${new Date(j.createdAt).toLocaleDateString()}</td>
                <td><button class="btn btn-secondary btn-small danger" data-delete-job="${j.id}">Delete</button></td>
              </tr>
            `).join("")
      : `<tr><td colspan="6"><div class="empty">No jobs yet.</div></td></tr>`
    }
      </tbody>
    </table>
  `;

  inqBox.querySelectorAll("[data-read]").forEach((btn) => {
    btn.addEventListener("click", () => setInquiryStatus(btn.dataset.read, "Read"));
  });

  svcBox.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.addEventListener("click", () => setServiceStatus(btn.dataset.approve, "Approved"));
  });

  svcBox.querySelectorAll("[data-reject]").forEach((btn) => {
    btn.addEventListener("click", () => setServiceStatus(btn.dataset.reject, "Rejected"));
  });

  jobBox.querySelectorAll("[data-delete-job]").forEach((btn) => {
    btn.addEventListener("click", () => deleteJob(btn.dataset.deleteJob));
  });
}

/* ---------- Login / Register ---------- */
function setupLoginForm() {
  const form = $("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = loginUser($("loginEmail").value, $("loginPassword").value);
    const note = $("loginNote");

    if (!result.ok) {
      note.textContent = result.message;
      note.className = "notice danger";
      return;
    }

    window.location.href = result.user.role === "Admin" ? "admin.html" : "index.html";
  });
}

function setupRegisterForm() {
  const form = $("registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("regName").value.trim();
    const email = $("regEmail").value.trim();
    const password = $("regPassword").value;
    const role = $("regRole").value;
    const note = $("registerNote");

    if (password.length < 6) {
      note.textContent = "Password must be at least 6 characters.";
      note.className = "notice danger";
      return;
    }

    const result = registerUser({ name, email, password, role });

    if (!result.ok) {
      note.textContent = result.message;
      note.className = "notice danger";
      return;
    }

    window.location.href = role === "Admin" ? "admin.html" : "index.html";
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  ensureSeedUsers();
  seedAppData();
  renderAuthArea();
  updateAdminLinks();
  setActiveNav();
  setupNavToggle();

  renderTourism();
  renderDestination();
  renderInfrastructure();
  renderInvestment();
  renderCommunity();
  renderAdmin();
  setupLoginForm();
  setupRegisterForm();
});