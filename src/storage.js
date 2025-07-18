export function load(key, def) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : def;
}

export function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function createId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
