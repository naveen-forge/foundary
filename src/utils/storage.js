// Small wrapper around localStorage so the rest of the app never
// touches JSON.parse/stringify or worries about a missing key.

const NAMESPACE = 'foundry';

function key(name) {
  return `${NAMESPACE}:${name}`;
}

export function readList(name) {
  try {
    const raw = localStorage.getItem(key(name));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Could not read "${name}" from storage`, err);
    return [];
  }
}

export function writeList(name, list) {
  try {
    localStorage.setItem(key(name), JSON.stringify(list));
  } catch (err) {
    console.error(`Could not write "${name}" to storage`, err);
  }
}

export function readValue(name, fallback = null) {
  try {
    const raw = localStorage.getItem(key(name));
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Could not read "${name}" from storage`, err);
    return fallback;
  }
}

export function writeValue(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch (err) {
    console.error(`Could not write "${name}" to storage`, err);
  }
}

export function removeValue(name) {
  localStorage.removeItem(key(name));
}

export function makeId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
