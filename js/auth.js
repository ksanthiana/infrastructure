// js/auth.js

function getUsers() {
  return readLS("users", []);
}
function saveUsers(users) {
  writeLS("users", users);
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

function requireAuth(allowedRoles = []) {
  const user = getSession();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    alert("Access denied for your role.");
    window.location.href = "index.html";
    return null;
  }
  return user;
}

function updateNavAuthUI() {
  const user = getSession();
  const authBox = document.getElementById("authBox");
  if (!authBox) return;

  if (!user) {
    authBox.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  } else {
    authBox.innerHTML = `
      <span>Hi, <strong>${user.name}</strong> (${user.role})</span>
      <button id="logoutBtn" type="button">Logout</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", logout);
  }
}

function isAdmin() {
  const u = getSession();
  return !!u && u.role === "Admin";
}
