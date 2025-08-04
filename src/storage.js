export function load(key, def) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : def;
  } catch (err) {
    console.error('Failed to load from storage', err);
    return def;
  }
}

export function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to save to storage', err);
    throw err;
  }
}

export function createId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
