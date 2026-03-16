function getUsers() {
  return readLS("users", []);
}

function saveUsers(users) {
  writeLS("users", users);
}

function ensureSeedUsers() {
  const users = getUsers();
  const hasAdmin = users.some((u) => u.email === "admin@sitburundi.com");
  if (!hasAdmin) {
    users.push({
      id: "admin-1",
      name: "Platform Admin",
      email: "admin@sitburundi.com",
      password: "Admin123!",
      role: "Admin",
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }
}

function registerUser({ name, email, password, role }) {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, message: "An account with this email already exists." };
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);
  setSession(user);
  return { ok: true, user };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );

  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  setSession(user);
  return { ok: true, user };
}

function setSession(user) {
  writeLS("sessionUser", user);
}

function getSession() {
  return readLS("sessionUser", null);
}

function logout() {
  localStorage.removeItem("sessionUser");
  window.location.href = "login.html";
}

function isAdmin() {
  const u = getSession();
  return !!u && u.role === "Admin";
}

function requireAuth(allowedRoles = []) {
  const user = getSession();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    alert("You do not have access to this page.");
    window.location.href = "index.html";
    return null;
  }

  return user;
}

function updateNavAuthUI() {
  const authArea = document.getElementById("authArea");

  if (!authArea) return;

  const user = getSession();

  if (!user) {
    authArea.innerHTML = `
      <a class="nav-ghost" href="register.html">Sign up</a>
      <a class="nav-cta" href="login.html">Login</a>
    `;
    return;
  }

  authArea.innerHTML = `
    <span class="auth-chip">Hi, <strong>${user.name}</strong> (${user.role})</span>
    <button class="nav-ghost auth-btn" id="logoutBtn" type="button">Logout</button>
  `;

  const btn = document.getElementById("logoutBtn");
  if (btn) btn.addEventListener("click", logout);
}

// Keep renderAuthArea for backwards compatibility if needed elsewhere
function renderAuthArea() {
  updateNavAuthUI();
}

function updateAdminLinks() {
  const adminLinks = document.querySelectorAll("[data-admin-link]");
  const show = isAdmin();
  adminLinks.forEach((link) => {
    link.style.display = show ? "" : "none";
  });
}