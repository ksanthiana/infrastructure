// js/app.js
// Main Application Logic

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

// -------------------- 1. TOURISM MODULE --------------------

function renderDestinations() {
  const container = $("destinations");
  if (!container) return;

  // Use the 'destinations' array from data.js
  container.innerHTML = destinations
    .map(
      (d) => `
      <div class="card">
        <img src="${d.image}" alt="${d.name}" loading="lazy" style="height: 200px; width: 100%; object-fit: cover; border-radius: 8px 8px 0 0;">
        <div class="card-content">
          <h3>${d.name}</h3>
          <p><strong>Region:</strong> ${d.region}</p>
          <p><strong>Category:</strong> ${d.category}</p>
          <p>${d.description.substring(0, 100)}...</p>
          <a class="btn" href="destination.html?id=${encodeURIComponent(d.id)}">View details</a>
        </div>
      </div>
    `
    )
    .join("");
}

function renderDestinationDetails() {
  const detailsBox = $("destinationDetails");
  if (!detailsBox) return;

  const id = getQueryParam("id");
  const d = destinations.find((x) => x.id === id);

  if (!d) {
    detailsBox.innerHTML = `<p class="error">Destination not found.</p>`;
    return;
  }

  // Calculate average locally since we don't have a helper for it yet
  function averageScore(arr) {
    if (!arr.length) return 0;
    const sum = arr.reduce((a, b) => a + b, 0);
    return Math.round(sum / arr.length);
  }

  const accessAvg = averageScore([d.access.road, d.access.transport, d.access.ict, d.access.utilities]);

  detailsBox.innerHTML = `
    <div class="card">
       <img src="${d.image}" alt="${d.name}" style="height: 300px; width: 100%; object-fit: cover; border-radius: 8px;">
       <div class="card-content">
        <h2>${d.name}</h2>
        <p><strong>Region:</strong> ${d.region}</p>
        <p><strong>Category:</strong> ${d.category}</p>
        <p>${d.description}</p>

        <h3>Services</h3>
        <ul>${d.services.map((s) => `<li>${s}</li>`).join("")}</ul>

        <h3>Accessibility Readiness</h3>
        <p><strong>Road:</strong> ${d.access.road}/100</p>
        <p><strong>Transport:</strong> ${d.access.transport}/100</p>
        <p><strong>ICT/Internet:</strong> ${d.access.ict}/100</p>
        <p><strong>Utilities:</strong> ${d.access.utilities}/100</p>
        <div class="score-badge">
           <strong>Overall readiness:</strong> ${accessAvg}/100
        </div>
      </div>
    </div>
  `;

  if (typeof L !== "undefined") {
    renderLeafletMap(d);
  } else {
    console.warn("Leaflet (L) is not loaded. Map will not be displayed.");
  }
}

function renderLeafletMap(destination) {
  const mapBox = $("map");
  if (!mapBox) return;

  const map = L.map("map").setView([destination.lat, destination.lng], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker([destination.lat, destination.lng])
    .addTo(map)
    .bindPopup(`<b>${destination.name}</b><br>${destination.region}`)
    .openPopup();
}

// -------------------- 2. INFRASTRUCTURE MODULE --------------------

function averageScore(arr) {
  if (!arr.length) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return Math.round(sum / arr.length);
}

function readinessLabel(score) {
  if (score >= 75) return "Good";
  if (score >= 50) return "Moderate";
  return "Needs improvement";
}

function renderInfrastructure() {
  const container = $("zones");
  if (!container) return;

  container.innerHTML = tourismZones
    .map((z) => {
      const overall = averageScore([z.road, z.transport, z.ict, z.electricity, z.water, z.accommodation]);
      return `
        <div class="card">
          <h3>${z.name}</h3>
          <p><strong>Overall readiness:</strong> ${overall}/100 (${readinessLabel(overall)})</p>
          <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <p>Road: ${z.road}/100</p>
              <p>Transport: ${z.transport}/100</p>
              <p>ICT: ${z.ict}/100</p>
              <p>Electricity: ${z.electricity}/100</p>
              <p>Water: ${z.water}/100</p>
              <p>Accommodation: ${z.accommodation}/100</p>
          </div>

          <button class="btn" style="margin-top: 15px;" ${isAdmin() ? "" : "disabled"} onclick="exportZone('${z.id}')">
            Export mini report
          </button>
          ${isAdmin() ? "" : "<p style='font-size: 0.8rem; color: #666;'><em>Login as Admin to export reports.</em></p>"}
        </div>
      `;
    })
    .join("");
}

window.exportZone = function (zoneId) {
  if (!isAdmin()) {
    alert("Access Denied: You must be an Administrator to export reports.");
    return;
  }

  const z = tourismZones.find((x) => x.id === zoneId);
  if (!z) return;

  const overall = averageScore([z.road, z.transport, z.ict, z.electricity, z.water, z.accommodation]);

  const text = `
SMART TOURISM & INFRASTRUCTURE REPORT
-------------------------------------
Zone: ${z.name}
Date: ${new Date().toLocaleDateString()}
Overall Readiness: ${overall}/100 (${readinessLabel(overall)})

DETAILED SCORES:
- Road Infrastructure: ${z.road}
- Transport Availability: ${z.transport}
- ICT / Internet: ${z.ict}
- Electricity: ${z.electricity}
- Water Supply: ${z.water}
- Accommodation Capacity: ${z.accommodation}

Generated by: Smart Infrastructure & Tourism Development Platform (MVP)
  `.trim();

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${z.name.replace(/\s+/g, '_')}_Report.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// -------------------- 3. INVESTMENT MODULE --------------------

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

  // Highlighted opportunities (could be dynamic later)
  const opportunitiesHtml = `
    <div class="card">
      <h3>Priority Investment Zones</h3>
      <ul>
        <li><strong>Bujumbura:</strong> Luxury Eco-Hotel & Conference Center along Lake Tanganyika. High readiness.</li>
        <li><strong>Gitega:</strong> Cultural Heritage Center and budget accommodation upgrades. Moderate readiness.</li>
        <li><strong>Kibira:</strong> Sustainable Eco-Lodge & Primate Tracking infrastructure. Needs transport investment.</li>
      </ul>
    </div>
  `;

  // Inquiry Form
  const inquiryFormHtml = `
    <div class="card">
      <h3>Submit an Investor Inquiry</h3>
      <form id="inquiryForm">
        <div style="margin-bottom: 10px;">
            <label style="display:block; margin-bottom: 5px;">Target Zone</label>
            <select id="inqZone" required style="width: 100%; padding: 8px;">
            ${tourismZones.map(z => `<option value="${z.name}">${z.name}</option>`).join("")}
            </select>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="display:block; margin-bottom: 5px;">Investment Type</label>
            <select id="inqType" required style="width: 100%; padding: 8px;">
            <option value="Hospitality (Hotel/Lodge)">Hospitality (Hotel/Lodge)</option>
            <option value="Transport Services">Transport Services</option>
            <option value="ICT / Digital Services">ICT / Digital Services</option>
            <option value="Community Enterprise">Community Enterprise</option>
            </select>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="display:block; margin-bottom: 5px;">Message / Proposal</label>
            <textarea id="inqMessage" required placeholder="Describe your investment interest..." style="width: 100%; padding: 8px; height: 100px;"></textarea>
        </div>

        <button class="btn" type="submit">Submit Inquiry</button>
      </form>
    </div>
  `;

  const roleNote = !user
    ? `<div class="card"><p><em>Please <a href="login.html">login</a> to submit an inquiry.</em></p></div>`
    : (user.role !== "Investor" && user.role !== "Admin")
      ? `<div class="card"><p><em>You are logged in as <strong>${user.role}</strong>. Only <strong>Investors</strong> can submit inquiries.</em></p></div>`
      : "";

  box.innerHTML = opportunitiesHtml + roleNote;

  if (user && (user.role === "Investor" || user.role === "Admin")) {
    box.innerHTML += inquiryFormHtml;

    // Attach event listener after adding to DOM
    setTimeout(() => {
      const form = $("inquiryForm");
      if (form) {
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

          alert("Thank you! Your inquiry has been submitted to the Ministry/Admin.");
          form.reset();
        });
      }
    }, 0);
  }
}

// -------------------- 4. COMMUNITY & JOBS MODULE --------------------

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
      <h3>Local Services & SMEs</h3>
      ${approvedServices.length === 0 ? "<p><em>No listed services yet. Be the first!</em></p>" : ""}
      ${approvedServices.map(s => `
        <div class="mini-card">
          <h4>${s.businessName} <span style="font-size:0.8em; font-weight:normal; color:#666;">(${s.category})</span></h4>
          <p><strong>Location:</strong> ${s.location}</p>
          <p>${s.description}</p>
          <p><strong>Contact:</strong> ${s.contact}</p>
        </div>
        <hr>
      `).join("")}
    </div>
  `;

  // Public jobs list
  const jobsListHtml = `
    <div class="card">
      <h3>Jobs & Opportunities</h3>
      ${jobs.length === 0 ? "<p><em>No jobs posted yet.</em></p>" : ""}
      ${jobs.map(j => `
        <div class="mini-card">
          <h4>${j.title} <span style="font-size:0.8em; font-weight:normal; color:#666;">at ${j.company}</span></h4>
          <p><strong>Location:</strong> ${j.location} | <strong>Type:</strong> ${j.type}</p>
          <p>${j.description}</p>
          <button class="btn-small" onclick="alert('To apply, contact: ${j.applyContact}')">Apply Now</button>
        </div>
        <hr>
      `).join("")}
    </div>
  `;

  box.innerHTML = servicesListHtml + jobsListHtml;

  // Render Forms based on Role
  if (!user) {
    box.innerHTML += `<div class="card"><p><em><a href="login.html">Login</a> to register your business or view admin tools.</em></p></div>`;
    return;
  }

  // Community Member: Register Service
  if (user.role === "Community" || user.role === "Admin") {
    const serviceFormHtml = `
      <div class="card">
        <h3>Register Your Business (SME)</h3>
        <form id="serviceForm">
          <input id="svcName" required placeholder="Business Name" style="width:100%; margin-bottom:10px; padding:8px;" />
          
          <select id="svcCategory" required style="width:100%; margin-bottom:10px; padding:8px;">
            <option value="Guiding">Guiding & Tours</option>
            <option value="Accommodation">Accommodation (Guesthouse/Homestay)</option>
            <option value="Food & Restaurant">Food & Restaurant</option>
            <option value="Transport">Transport</option>
            <option value="Arts & Crafts">Arts & Crafts</option>
          </select>

          <input id="svcLocation" required placeholder="Location" style="width:100%; margin-bottom:10px; padding:8px;" />
          
          <textarea id="svcDesc" required placeholder="Description of services..." style="width:100%; margin-bottom:10px; padding:8px;"></textarea>
          
          <input id="svcContact" required placeholder="Contact Phone/Email" style="width:100%; margin-bottom:10px; padding:8px;" />

          <button class="btn" type="submit">Submit for Approval</button>
        </form>
      </div>
    `;
    box.innerHTML += serviceFormHtml;

    setTimeout(() => {
      const sf = $("serviceForm");
      if (sf) {
        sf.addEventListener("submit", (e) => {
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
          alert("Service submitted! It will appear after Admin approval.");
          sf.reset();
          renderCommunity(); // Re-render to show update (though it won't show in list until approved)
        });
      }
    }, 0);
  }

  // Admin: Post Jobs
  if (user.role === "Admin") {
    const jobFormHtml = `
      <div class="card">
        <h3>[Admin] Post a Job</h3>
        <form id="jobForm">
          <input id="jobTitle" required placeholder="Job Title" style="width:100%; margin-bottom:10px; padding:8px;" />
          <input id="jobCompany" required placeholder="Company" style="width:100%; margin-bottom:10px; padding:8px;" />
          <input id="jobLocation" required placeholder="Location" style="width:100%; margin-bottom:10px; padding:8px;" />
          
          <select id="jobType" required style="width:100%; margin-bottom:10px; padding:8px;">
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          <textarea id="jobDesc" required placeholder="Job Description..." style="width:100%; margin-bottom:10px; padding:8px;"></textarea>
          <input id="jobApply" required placeholder="How to Apply (Email/Phone)" style="width:100%; margin-bottom:10px; padding:8px;" />

          <button class="btn" type="submit">Post Job</button>
        </form>
      </div>
    `;

    box.innerHTML += jobFormHtml;

    setTimeout(() => {
      const jf = $("jobForm");
      if (jf) {
        jf.addEventListener("submit", (e) => {
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
          alert("Job posted successfully!");
          jf.reset();
          renderCommunity();
        });
      }
    }, 0);
  }
}

// -------------------- 5. ADMIN PANEL --------------------

function renderAdminPanel() {
  const inqBox = $("adminInquiries");
  const svcBox = $("adminServices");
  const jobBox = $("adminJobs");
  if (!inqBox && !svcBox && !jobBox) return;

  const user = requireAuth(["Admin"]);
  if (!user) return;

  // Inquiries
  const inquiries = getInquiries();
  inqBox.innerHTML = inquiries.length
    ? inquiries.map(i => `
      <div class="mini-card" style="border-left: 4px solid ${i.status === 'New' ? 'red' : 'green'}; padding-left: 10px;">
        <p><strong>${i.status}</strong> — ${new Date(i.createdAt).toLocaleDateString()}</p>
        <p><strong>From:</strong> ${i.investorName} (${i.investorEmail})</p>
        <p><strong>Zone:</strong> ${i.zone} | <strong>Type:</strong> ${i.type}</p>
        <p><em>"${i.message}"</em></p>
        <div>
          <button class="btn-small" onclick="setInquiryStatus('${i.id}', 'In Review')">Mark Reading</button>
          <button class="btn-small" onclick="setInquiryStatus('${i.id}', 'Resolved')">Mark Resolved</button>
        </div>
      </div>
      <hr>
    `).join("")
    : "<p><em>No inquiries yet.</em></p>";

  // Services
  const services = getServices();
  svcBox.innerHTML = services.length
    ? services.map(s => `
      <div class="mini-card" style="border-left: 4px solid ${s.status === 'Pending' ? 'orange' : 'blue'}; padding-left: 10px;">
        <p><strong>${s.status}</strong> — ${s.businessName}</p>
        <p>Owner: ${s.ownerName}</p>
        <p><em>${s.description}</em></p>
        <div>
          <button class="btn-small" onclick="setServiceStatus('${s.id}', 'Approved')">Approve</button>
          <button class="btn-small" onclick="setServiceStatus('${s.id}', 'Rejected')">Reject</button>
        </div>
      </div>
      <hr>
    `).join("")
    : "<p><em>No services yet.</em></p>";

  // Jobs
  const jobs = getJobs();
  jobBox.innerHTML = jobs.length
    ? jobs.map(j => `
      <div class="mini-card">
        <p><strong>${j.title}</strong> at ${j.company}</p>
        <button class="btn-small" style="background:#cc0000;" onclick="deleteJob('${j.id}')">Delete</button>
      </div>
    `).join("")
    : "<p><em>No jobs yet.</em></p>";
}

// Admin Actions (Global)
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

// -------------------- MAIN BOOTSTRAP --------------------

function hideAdminLinkIfNeeded() {
  const user = getSession();
  const adminLinks = document.querySelectorAll('a[href="admin.html"]');
  adminLinks.forEach(link => {
    if (!user || user.role !== "Admin") {
      link.style.display = "none";
    } else {
      link.style.display = "inline-block";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavAuthUI();
  hideAdminLinkIfNeeded();

  // Check which page we are on and render appropriate content
  if ($("destinations")) renderDestinations();
  if ($("destinationDetails")) renderDestinationDetails();
  if ($("zones")) renderInfrastructure();
  if ($("investmentBox")) renderInvestment();
  if ($("communityBox")) renderCommunity();
  if ($("adminInquiries")) renderAdminPanel();
});
