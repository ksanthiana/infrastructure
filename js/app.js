// js/app.js

function $(id) {
  return document.getElementById(id);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function nowISO() {
  return new Date().toISOString();
}

function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// -------------------- Tourism --------------------
function getDiscoveryRole() {
  return sessionStorage.getItem("discoveryRole");
}

window.setDiscoveryRole = function(role) {
  sessionStorage.setItem("discoveryRole", role);
  const overlay = $("fitCheckOverlay");
  if (overlay) overlay.style.display = "none";
  renderDestinations();
};

window.handleSearch = function() {
  renderDestinations();
};

function renderDestinations() {
  const container = $("destinations");
  if (!container) return;

  const role = getDiscoveryRole();
  const overlay = $("fitCheckOverlay");
  
  // Show Fit Check if no role selected and we are on tourism.html
  if (!role && overlay) {
    overlay.style.display = "flex";
  }

  const query = $("searchInput") ? $("searchInput").value.toLowerCase() : "";
  const catFilter = $("roleFilter") ? $("roleFilter").value : "";

  const filtered = destinations.filter(d => {
    const matchesQuery = d.name.toLowerCase().includes(query) || 
                         d.province.toLowerCase().includes(query) || 
                         (d.landmarkDirections && d.landmarkDirections.toLowerCase().includes(query));
    const matchesCat = !catFilter || d.category === catFilter;
    
    // Safety check: only show if the discovery role has visibility
    const roleVisible = !role || (d.visibilityRoles && d.visibilityRoles.includes(role));
    
    return matchesQuery && matchesCat && roleVisible;
  });

  container.innerHTML = filtered
    .map(
      (d) => `
      <div class="card" data-tags="${d.category}">
        <div class="cover">
          <img src="${d.image}" alt="${d.name}">
        </div>
        <div class="card-body">
          <div class="badge">${d.category.toUpperCase()}</div>
          <h3 class="card-title" style="margin-top: 10px;">${d.name}</h3>
          <p class="card-text"><strong>Region:</strong> ${d.region} (${d.province})</p>
          <div class="verified-badge">✓ Verified by ${d.verifiedBy || 'Community'}</div>
          <p class="card-text" style="margin-top: 10px;">${d.description}</p>
          <a class="card-link" href="destination.html?id=${encodeURIComponent(d.id)}">Reveal safe route →</a>
        </div>
      </div>
    `
    )
    .join("");

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">
      <p>No destinations found matching your search or role safety constraints.</p>
    </div>`;
  }
}

function renderDestinationDetails() {
  const detailsBox = $("destinationDetails");
  if (!detailsBox) return;

  const id = getQueryParam("id");
  const d = destinations.find((x) => x.id === id);

  if (!d) {
    detailsBox.innerHTML = `<p class="error">Destination not found or restricted.</p>`;
    return;
  }

  const zone = tourismZones.find(z => z.id === d.zoneId) || {};
  const accessAvg = averageScore([zone.road || 0, zone.transport || 0, zone.ict || 0, zone.electricity || 0, zone.water || 0, zone.accommodation || 0]);

  detailsBox.innerHTML = `
    <div class="card" style="margin-bottom: 20px;">
      <div class="cover" style="height: 280px;">
        <img src="${d.image}" alt="${d.name}" style="height: 100%; width: 100%; object-fit: cover;">
      </div>
      <div class="card-body">
        <div class="badge">${d.label || d.category}</div>
        <div class="verified-badge" style="margin-left: 10px;">✓ Verified by ${d.verifiedBy}</div>
        <h2 style="margin-top: 10px;">${d.name}</h2>
        
        <div class="landmark-info">
          <strong>📍 Safe Discovery Route (Landmark-based):</strong><br>
          ${d.landmarkDirections}
        </div>

        <p class="card-text" style="margin-top: 15px;">${d.description}</p>

        <h3 style="margin-top: 16px;">Community-Verified Services</h3>
        <ul style="color: rgba(15, 23, 42, .7); padding-left: 20px; font-size: 13px;">${d.services.map((s) => `<li>${s}</li>`).join("")}</ul>

        <h3 style="margin-top: 16px;">Infrastructure Readiness (Zone: ${zone.name || 'Unmapped'})</h3>
        <p><strong>Overall readiness:</strong> ${accessAvg}/100</p>
        <p class="muted">Note: We use landmark directions rather than exact GPS points to ensure community safety and accuracy where maps fail.</p>
      </div>
    </div>
  `;

  // Re-enabling the map for visual context
  const mapBox = $("map");
  if (mapBox) {
    mapBox.style.display = "block";
    if (typeof L !== "undefined") {
      renderLeafletMap(d);
    }
  }
}

function renderLeafletMap(destination) {
  const mapContainer = $("map");
  if (!mapContainer) return;

  // Clear existing map instance if any
  if (window.mapInstance) {
    window.mapInstance.remove();
  }

  const map = L.map("map").setView([destination.lat, destination.lng], 13);
  window.mapInstance = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker([destination.lat, destination.lng])
    .addTo(map)
    .bindPopup(`<b>${destination.name}</b><br>${destination.landmarkDirections}`)
    .openPopup();
}

// -------------------- Infrastructure --------------------
function readinessLabel(score) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Moderate";
  return "Needs improvement";
}

function renderInfrastructure() {
  const cardsContainer = $("infraCards");
  const tableContainer = $("infraTableBody");
  if (!cardsContainer || !tableContainer) return;

  // 1. Calculate and render aggregate summary cards
  const allRoad = tourismZones.map(z => z.road);
  const allUtils = tourismZones.map(z => (z.electricity + z.water) / 2);
  const allIct = tourismZones.map(z => z.ict);
  const allAcc = tourismZones.map(z => z.accommodation);

  const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  cardsContainer.innerHTML = `
    <div class="card">
      <div class="card-body"><span class="badge">🛣️ Roads</span>
        <h3 class="card-title">${avg(allRoad)}/100</h3>
        <p class="card-text">Average access quality across community-verified routes.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body"><span class="badge">💧 Utilities</span>
        <h3 class="card-title">${avg(allUtils)}/100</h3>
        <p class="card-text">Power and water reliability in mapped tourism zones.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body"><span class="badge">📶 ICT</span>
        <h3 class="card-title">${avg(allIct)}/100</h3>
        <p class="card-text">Network coverage and community hotspot availability.</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body"><span class="badge">🏠 Stays</span>
        <h3 class="card-title">${avg(allAcc)}/100</h3>
        <p class="card-text">Accommodation readiness for visitors and investors.</p>
      </div>
    </div>
  `;

  // 2. Render the detailed table
  tableContainer.innerHTML = tourismZones
    .map((z) => {
      const overall = averageScore([z.road, z.transport, z.ict, z.electricity, z.water, z.accommodation]);
      const statusClass = overall >= 75 ? "ok" : (overall >= 50 ? "warn" : "bad");
      const statusLabel = readinessLabel(overall);

      return `
        <tr>
          <td><strong>${z.name}</strong></td>
          <td><span class="pill ${statusClass}">${overall}/100 • ${statusLabel}</span></td>
          <td>${z.keyGap}</td>
          <td>${z.recommendation}</td>
          <td>
            <button class="btn btn-small" ${isAdmin() ? "" : "disabled"} onclick="exportZone('${z.id}')">
              Export
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

window.exportZone = function (zoneId) {
  if (!isAdmin()) return;

  const z = tourismZones.find((x) => x.id === zoneId);
  if (!z) return;

  const overall = averageScore([z.road, z.transport, z.ict, z.electricity, z.water, z.accommodation]);

  const text = `
Zone: ${z.name}
Overall readiness: ${overall}/100

Scores:
- Road: ${z.road}
- Transport: ${z.transport}
- ICT: ${z.ict}
- Electricity: ${z.electricity}
- Water: ${z.water}
- Accommodation: ${z.accommodation}

Generated by: Smart Infrastructure & Tourism Development Platform (MVP)
  `.trim();

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${z.id}-report.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// -------------------- A) INVESTMENT --------------------
function getInquiries() {
  return readLS("investor_inquiries", []);
}
function saveInquiries(items) {
  writeLS("investor_inquiries", items);
}

function renderInvestment() {
  const box = $("investmentBox");
  if (!box) return;

  const user = getSession();

  // Anyone can view opportunities
  const opportunitiesHtml = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Investment Opportunities</h3>
        <ul class="card-text" style="padding-left: 20px;">
          <li><strong>Bujumbura:</strong> Hotel/Lodge development + transport partnerships</li>
          <li><strong>Gitega:</strong> Cultural tourism packages + accommodation upgrades</li>
          <li><strong>North-West (Kibira):</strong> Eco-lodge pilot + guided trail services</li>
        </ul>
      </div>
    </div>
  `;

  // Only Investor (or Admin) can submit inquiry (RBAC)
  const inquiryFormHtml = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Send an Investor Inquiry</h3>
        <form id="inquiryForm" class="form-grid">
          <label class="card-text">Target Zone</label>
          <select id="inqZone" class="select" required>
            ${tourismZones.map(z => `<option value="${z.name}">${z.name}</option>`).join("")}
          </select>

          <label class="card-text">Investment Type</label>
          <select id="inqType" class="select" required>
            <option value="Hospitality (Hotel/Lodge)">Hospitality (Hotel/Lodge)</option>
            <option value="Transport Services">Transport Services</option>
            <option value="ICT / Digital Services">ICT / Digital Services</option>
            <option value="Community Enterprise">Community Enterprise</option>
          </select>

          <label class="card-text">Message</label>
          <textarea id="inqMessage" class="textarea" required placeholder="Explain your interest, budget range, and what support you need."></textarea>

          <button class="btn btn-primary" type="submit" style="margin-top: 10px;">Submit Inquiry</button>
        </form>
        <p class="muted" style="margin-top: 10px;"><em>Your inquiry will be reviewed by Admin for follow-up.</em></p>
      </div>
    </div>
  `;

  const roleNote = !user
    ? `<p class="card"><em>Please login to send inquiries.</em></p>`
    : (user.role !== "Investor" && user.role !== "Admin")
      ? `<p class="card"><em>Only Investors can submit inquiries. (Admin can view/manage.)</em></p>`
      : "";

  box.innerHTML = opportunitiesHtml + roleNote;

  if (user && (user.role === "Investor" || user.role === "Admin")) {
    box.innerHTML += inquiryFormHtml;

    const form = $("inquiryForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const items = getInquiries();
      items.unshift({
        id: uid("inq"),
        createdAt: nowISO(),
        status: "New",
        investorName: user.name,
        investorEmail: user.email,
        zone: $("inqZone").value,
        type: $("inqType").value,
        message: $("inqMessage").value.trim()
      });
      saveInquiries(items);

      alert("Inquiry submitted successfully!");
      form.reset();
    });
  }

  // Admin shortcut
  if (isAdmin()) {
    box.innerHTML += `<div class="card"><a class="btn" href="admin.html">Go to Admin Panel</a></div>`;
  }
}

// -------------------- B) COMMUNITY SERVICES + JOBS --------------------
function getServices() {
  return readLS("community_services", []);
}
function saveServices(items) {
  writeLS("community_services", items);
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
  const services = getServices();
  const jobs = getJobs();

  // Public services list = only Approved
  const approvedServices = services.filter(s => s.status === "Approved");

  const servicesListHtml = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Approved Community Services</h3>
        ${approvedServices.length === 0 ? "<p class='muted'><em>No approved services yet.</em></p>" : ""}
        ${approvedServices.map(s => `
          <div class="mini-card">
            <p><strong>${s.businessName}</strong> (${s.category})</p>
            <p class="card-text"><strong>Location:</strong> ${s.location}</p>
            <p class="card-text">${s.description}</p>
            <p class="card-text"><strong>Contact:</strong> ${s.contact}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  // Public jobs list
  const jobsListHtml = `
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Jobs & Internships</h3>
        ${jobs.length === 0 ? "<p class='muted'><em>No jobs posted yet.</em></p>" : ""}
        ${jobs.map(j => `
          <div class="mini-card">
            <p><strong>${j.title}</strong> — ${j.company}</p>
            <p class="card-text"><strong>Location:</strong> ${j.location} | <strong>Type:</strong> ${j.type}</p>
            <p class="card-text">${j.description}</p>
            <p class="card-text"><strong>Apply:</strong> ${j.applyContact}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  box.innerHTML = servicesListHtml + jobsListHtml;

  // Community role: register service
  if (!user) {
    box.innerHTML += `<div class="card"><em>Login to register a service or post jobs (Admin only for jobs).</em></div>`;
    return;
  }

  if (user.role === "Community" || user.role === "Admin") {
    box.innerHTML += `
      <div class="card">
        <h3>Register a Community Service</h3>
        <form id="serviceForm" class="form-grid">
          <label>Business/Service Name</label>
          <input id="svcName" class="input" required placeholder="e.g., Tanganyika Boat Tours" />

          <label>Category</label>
          <select id="svcCategory" class="select" required>
            <option value="Guiding">Guiding</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Food & Restaurant">Food & Restaurant</option>
            <option value="Transport">Transport</option>
            <option value="Crafts & Souvenirs">Crafts & Souvenirs</option>
          </select>

          <label>Location</label>
          <input id="svcLocation" class="input" required placeholder="e.g., Bujumbura / Gitega / Near Kibira" />

          <label>Description</label>
          <textarea id="svcDesc" class="textarea" required placeholder="What do you offer? Price range? Availability?"></textarea>

          <label>Contact (phone/email)</label>
          <input id="svcContact" class="input" required placeholder="+257... or email" />

          <button class="btn btn-primary" style="margin-top: 10px;" type="submit">Submit for Approval</button>
        </form>
        <p><em>Status will be “Pending” until Admin approves.</em></p>
      </div>
    `;

    $("serviceForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const items = getServices();
      items.unshift({
        id: uid("svc"),
        createdAt: nowISO(),
        status: "Pending",
        ownerName: user.name,
        ownerEmail: user.email,
        businessName: $("svcName").value.trim(),
        category: $("svcCategory").value,
        location: $("svcLocation").value.trim(),
        description: $("svcDesc").value.trim(),
        contact: $("svcContact").value.trim()
      });
      saveServices(items);

      alert("Service submitted! Waiting for Admin approval.");
      e.target.reset();
      renderCommunity();
    });
  }

  // Admin role: post jobs (simple)
  if (user.role === "Admin") {
    box.innerHTML += `
      <div class="card">
        <h3>Post a Job / Internship (Admin)</h3>
        <form id="jobForm" class="form-grid">
          <label>Title</label>
          <input id="jobTitle" class="input" required placeholder="e.g., Tour Guide Intern" />

          <label>Company/Organization</label>
          <input id="jobCompany" class="input" required placeholder="e.g., Burundi Tourism Board" />

          <label>Location</label>
          <input id="jobLocation" class="input" required placeholder="e.g., Gitega" />

          <label>Type</label>
          <select id="jobType" class="select" required>
            <option value="Internship">Internship</option>
            <option value="Part-time">Part-time</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
          </select>

          <label>Description</label>
          <textarea id="jobDesc" class="textarea" required placeholder="Role details, requirements, duration..."></textarea>

          <label>Apply Contact</label>
          <input id="jobApply" class="input" required placeholder="email or phone" />

          <button class="btn btn-primary" style="margin-top: 10px;" type="submit">Post Job</button>
        </form>
      </div>
    `;

    $("jobForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const items = getJobs();
      items.unshift({
        id: uid("job"),
        createdAt: nowISO(),
        title: $("jobTitle").value.trim(),
        company: $("jobCompany").value.trim(),
        location: $("jobLocation").value.trim(),
        type: $("jobType").value,
        description: $("jobDesc").value.trim(),
        applyContact: $("jobApply").value.trim()
      });
      saveJobs(items);
      alert("Job posted!");
      e.target.reset();
      renderCommunity();
    });

    box.innerHTML += `<div class="card"><a class="btn" href="admin.html">Go to Admin Panel</a></div>`;
  }
}

// -------------------- C) FEEDBACK & REPORTING (FR-13) --------------------
function getFeedbacks() {
  return readLS("feedbacks", []);
}
function saveFeedbacks(items) {
  writeLS("feedbacks", items);
}

function renderFeedbackForm() {
  const box = $("feedbackBox");
  if (!box) return;

  const user = getSession();
  if (!user) {
    box.innerHTML = `<div class="card"><div class="card-body"><em>Please log in to submit feedback or report issues.</em></div></div>`;
    return;
  }

  box.innerHTML = `
    <div class="card">
      <div class="card-body">
        <form id="feedbackForm" class="form-grid">
          <label class="label">Issue Type / Subject</label>
          <select id="fbSubject" class="select" required>
            <option value="Infrastructure Issue">Infrastructure Issue (Road/Water/Power)</option>
            <option value="Destination Request">Suggest New Destination</option>
            <option value="Safety/Mapping Report">Safety/Mapping Report</option>
            <option value="General Feedback">General Feedback</option>
          </select>

          <label class="label">Message Details</label>
          <textarea id="fbMessage" class="textarea" required placeholder="Describe the issue, location, or feedback..."></textarea>

          <button class="btn btn-primary" style="margin-top: 10px;" type="submit">Submit Report</button>
        </form>
      </div>
    </div>
  `;

  const form = $("feedbackForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const items = getFeedbacks();
      items.unshift({
        id: uid("fb"),
        createdAt: nowISO(),
        status: "Pending",
        userName: user.name,
        userEmail: user.email,
        subject: $("fbSubject").value,
        message: $("fbMessage").value.trim()
      });
      saveFeedbacks(items);
      alert("Thank you! Your feedback has been submitted to the administration.");
      e.target.reset();
    });
  }
}

// -------------------- Admin Panel (Approvals) --------------------
function renderAdminPanel() {
  const statsBox = $("adminStats");
  const inqBox = $("adminInquiries");
  const svcBox = $("adminServices");
  const jobBox = $("adminJobs");
  const contentBox = $("adminContent");
  const feedbackBox = $("adminFeedbacks");
  
  if (!statsBox && !inqBox && !svcBox && !jobBox && !contentBox && !feedbackBox) return;

  const user = requireAuth(["Admin"]);
  if (!user) return;

  const inquiries = getInquiries();
  const services = getServices();
  const jobs = getJobs();
  const feedbacks = getFeedbacks();

  // 1. Render Stats
  if (statsBox) {
    statsBox.innerHTML = `
      <div class="card">
        <div class="card-body">
          <span class="badge">Inquiries</span>
          <h3 class="card-title">${inquiries.length}</h3>
          <p class="muted">Investor requests</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <span class="badge">Services</span>
          <h3 class="card-title">${services.filter(s => s.status === 'Pending').length}</h3>
          <p class="muted">Pending approval</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <span class="badge">Jobs</span>
          <h3 class="card-title">${jobs.length}</h3>
          <p class="muted">Active listings</p>
        </div>
      </div>
    `;
  }

  // 2. Inquiries Table
  if (inqBox) {
    inqBox.innerHTML = inquiries.length
      ? `
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Investor</th>
              <th>Zone / Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${inquiries.map(i => `
              <tr>
                <td>${new Date(i.createdAt).toLocaleDateString()}</td>
                <td><strong>${i.investorName}</strong><br><small>${i.investorEmail}</small></td>
                <td>${i.zone}<br><small>${i.type}</small></td>
                <td><span class="pill ${i.status === 'Resolved' ? 'ok' : (i.status === 'In Review' ? 'warn' : 'bad')}">${i.status}</span></td>
                <td>
                  <button class="btn btn-small" onclick="setInquiryStatus('${i.id}', 'In Review')">Review</button>
                  <button class="btn btn-small btn-primary" onclick="setInquiryStatus('${i.id}', 'Resolved')">Resolve</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `
      : "<p class='muted'><em>No inquiries yet.</em></p>";
  }

  // 3. Services Table
  if (svcBox) {
    svcBox.innerHTML = services.length
      ? `
        <table class="table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${services.map(s => `
              <tr>
                <td><strong>${s.businessName}</strong><br><small>${s.category}</small></td>
                <td>${s.ownerName}<br><small>${s.location}</small></td>
                <td><span class="pill ${s.status === 'Approved' ? 'ok' : (s.status === 'Pending' ? 'warn' : 'bad')}">${s.status}</span></td>
                <td>
                  <button class="btn btn-small btn-primary" onclick="setServiceStatus('${s.id}', 'Approved')">Approve</button>
                  <button class="btn btn-small danger" onclick="setServiceStatus('${s.id}', 'Rejected')">Reject</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `
      : "<p class='muted'><em>No services submitted yet.</em></p>";
  }

  // 4. Jobs Moderation
  if (jobBox) {
    jobBox.innerHTML = jobs.length
      ? jobs.map(j => `
        <div class="mini-card" style="margin-bottom: 12px; padding: 12px; border-radius: 8px;">
          <p style="margin:0"><strong>${j.title}</strong></p>
          <p class="muted" style="font-size: 11px; margin-bottom: 8px;">${j.company} | ${j.location}</p>
          <button class="btn btn-small danger" onclick="deleteJob('${j.id}')">Delete</button>
        </div>
      `).join("")
      : "<p class='muted'><em>No jobs posted yet.</em></p>";
  }

  // 5. Admin Content Management (FR-08)
  if (contentBox) {
    contentBox.innerHTML = `
      <form id="addDestForm" class="form-grid" style="margin-bottom: 24px;">
        <label class="label">Add New Tourism Destination</label>
        <input id="addDestName" class="input" required placeholder="Name (e.g. New Safari Park)" />
        <input id="addDestRegion" class="input" required placeholder="Region / Province" />
        <select id="addDestCat" class="select" required>
          <option value="lake">Lake</option>
          <option value="park">Park</option>
          <option value="culture">Culture</option>
          <option value="nature">Nature</option>
        </select>
        <textarea id="addDestDesc" class="textarea" required placeholder="Short Description..."></textarea>
        <button class="btn btn-primary" type="submit" style="margin-top: 10px;">Add Destination</button>
      </form>
    `;

    $("addDestForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const nD = {
        id: uid("dst"),
        name: $("addDestName").value.trim(),
        region: $("addDestRegion").value.trim(),
        province: $("addDestRegion").value.trim(),
        category: $("addDestCat").value,
        label: $("addDestCat").options[$("addDestCat").selectedIndex].text,
        description: $("addDestDesc").value.trim(),
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        landmarkDirections: "Follow main signs.",
        verifiedBy: "Admin",
        visibilityRoles: ["Tourist", "Investor", "Community", "Admin"],
        services: [],
        zoneId: "bujumbura",
        lat: -3.3,
        lng: 29.3
      };
      
      const updatedDest = [nD, ...destinations];
      saveDestinations(updatedDest);
      alert("New destination added successfully!");
      e.target.reset();
    });
  }

  // 6. User Feedback / Reports (FR-13)
  if (feedbackBox) {
    feedbackBox.innerHTML = feedbacks.length
      ? `
        <table class="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Subject & Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${feedbacks.map(f => `
              <tr>
                <td><strong>${f.userName}</strong><br><small>${new Date(f.createdAt).toLocaleDateString()}</small></td>
                <td><strong>${f.subject}</strong><br>${f.message}</td>
                <td><span class="pill ${f.status === 'Resolved' ? 'ok' : 'warn'}">${f.status}</span></td>
                <td>
                  <button class="btn btn-small btn-primary" onclick="setFeedbackStatus('${f.id}', 'Resolved')">Resolve</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `
      : "<p class='muted'><em>No feedback or reports yet.</em></p>";
  }
}

window.setFeedbackStatus = function(id, status) {
  const items = getFeedbacks();
  const idx = items.findIndex(x => x.id === id);
  if (idx > -1) {
    items[idx].status = status;
    saveFeedbacks(items);
    renderAdminPanel();
  }
};

window.setInquiryStatus = function (id, status) {
  const items = getInquiries();
  const idx = items.findIndex(x => x.id === id);
  if (idx < 0) return;
  items[idx].status = status;
  saveInquiries(items);
  renderAdminPanel();
};

window.setServiceStatus = function (id, status) {
  const items = getServices();
  const idx = items.findIndex(x => x.id === id);
  if (idx < 0) return;
  items[idx].status = status;
  saveServices(items);
  renderAdminPanel();
};

window.deleteJob = function (id) {
  const items = getJobs().filter(j => j.id !== id);
  saveJobs(items);
  renderAdminPanel();
};

// -------------------- RBAC: hide admin link if not admin --------------------
function hideAdminLinkIfNeeded() {
  const adminLink = document.querySelector('a[href="admin.html"]');
  if (!adminLink) return;
  if (!isAdmin()) adminLink.style.display = "none";
}

// -------------------- Boot --------------------
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mandatory Login Gate
  if (typeof checkLoginGate === "function") checkLoginGate();

  // 2. Ensure admin exists
  if (typeof ensureSeedUsers === "function") ensureSeedUsers();

  // 3. UI Updates
  updateNavAuthUI();
  hideAdminLinkIfNeeded();

  // 4. Page Rendering
  renderDestinations();
  renderDestinationDetails();
  renderInfrastructure();
  renderInvestment();
  renderCommunity();
  renderFeedbackForm();
  renderAdminPanel();

  // 5. Auth Form Handling
  const loginForm = $("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const res = loginUser($("loginEmail")?.value, $("loginPassword")?.value);
      if (res.ok) window.location.href = "index.html";
      else alert(res.message);
    });
  }

  const registerForm = $("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pass = $("regPassword")?.value;
      if (pass?.length < 6) return alert("Password too short");
      const res = registerUser({
        name: $("regName")?.value,
        email: $("regEmail")?.value,
        password: pass,
        role: $("regRole")?.value
      });
      if (res.ok) {
        alert("Success! Redirecting...");
        window.location.href = "index.html";
      } else alert(res.message);
    });
  }

  // 6. Global Discovery Role Modal
  const role = getDiscoveryRole();
  const overlay = $("fitCheckOverlay");
  if (!role && overlay) {
    // Show Fit Check if no role selected and the overlay is present (e.g. index.html or tourism.html)
    overlay.style.display = "flex";
  }
});