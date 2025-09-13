const BASE_URL = 'http://localhost:3000';

export async function createKey(name, durationDays, password) {
  return fetch(`${BASE_URL}/create-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', password },
    body: JSON.stringify({ name, durationDays })
  }).then(res=>res.json());
}