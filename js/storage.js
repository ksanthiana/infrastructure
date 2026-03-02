function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedLS(key, value) {
  if (!localStorage.getItem(key)) {
    writeLS(key, value);
  }
}