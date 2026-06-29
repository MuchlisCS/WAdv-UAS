// frontend/src/api.js
// Semua fungsi fetch ke backend dikumpulkan di sini.
// BASE_URL pakai /api karena Vite proxy → localhost:3000

const BASE_URL = '/api'

// ── Helper umum ───────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  // 204 No Content tidak punya body
  if (res.status === 204) return null
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || `Request gagal (${res.status})`)
  return json
}

// ── Categories ────────────────────────────────────────────────
export const getCategories = () => request('/categories')

// ── Products ──────────────────────────────────────────────────
export const getProducts   = () => request('/products')

export const createProduct = (data) =>
  request('/products', { method: 'POST', body: JSON.stringify(data) })

export const updateProduct = (id, data) =>
  request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: 'DELETE' })
