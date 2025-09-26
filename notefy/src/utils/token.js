// src/utils/token.js
export function getValidToken() {
  const t = localStorage.getItem('token');
  if (!t) return null;
  try {
    const p = JSON.parse(atob(t.split('.')[1]));
    if (Date.now() > (p.exp * 1000 + 5000)) {
      localStorage.removeItem('token');
      return null;
    }
    return t;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
}