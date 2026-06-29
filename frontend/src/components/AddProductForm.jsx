// frontend/src/components/AddProductForm.jsx
import { useState } from 'react'

export default function AddProductForm({ categories, onAdd }) {
  const [form, setForm] = useState({ name: '', price: '', stock: '0', categoryId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.price || !form.categoryId) {
      setError('Nama, harga, dan kategori wajib diisi.')
      return
    }

    setLoading(true)
    try {
      await onAdd({
        name: form.name.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        categoryId: parseInt(form.categoryId),
      })
      setForm({ name: '', price: '', stock: '0', categoryId: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-content">
        <span className="card-title">
          <i className="material-icons tiny" style={{ verticalAlign: 'middle', marginRight: 6 }}>add_circle</i>
          Tambah Produk
        </span>

        {error && (
          <div className="card-panel red lighten-4 red-text text-darken-3" style={{ padding: '8px 14px', marginBottom: 8 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row" style={{ marginBottom: 0 }}>
            <div className="input-field col s12 m6">
              <input
                id="name" name="name" type="text"
                value={form.name} onChange={handleChange}
                placeholder="Nama produk"
              />
              <label htmlFor="name">Nama Produk</label>
            </div>
            <div className="input-field col s12 m6">
              <input
                id="price" name="price" type="number" min="0"
                value={form.price} onChange={handleChange}
                placeholder="0"
              />
              <label htmlFor="price">Harga (Rp)</label>
            </div>
          </div>

          <div className="row" style={{ marginBottom: 0 }}>
            <div className="input-field col s12 m6">
              <input
                id="stock" name="stock" type="number" min="0"
                value={form.stock} onChange={handleChange}
              />
              <label htmlFor="stock" className="active">Stok</label>
            </div>
            <div className="input-field col s12 m6">
              <select
                className="browser-default"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                style={{ padding: '10px 8px', border: '1px solid #9e9e9e', borderRadius: 4, marginTop: 20, width: '100%' }}
              >
                <option value="">— Pilih Kategori —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`btn blue darken-4 waves-effect waves-light ${loading ? 'disabled' : ''}`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
            <i className="material-icons right">send</i>
          </button>
        </form>
      </div>
    </div>
  )
}
