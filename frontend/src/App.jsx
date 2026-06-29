// frontend/src/App.jsx
// Root component — semua state ada di sini, diturunkan ke child lewat props
// Ini pola "lifting state up" yang fundamental di React

import { useState, useEffect } from 'react'
import { getCategories, getProducts, createProduct, deleteProduct } from './api.js'

import Navbar          from './components/Navbar.jsx'
import CategoryFilter  from './components/CategoryFilter.jsx'
import ProductCard     from './components/ProductCard.jsx'
import AddProductForm  from './components/AddProductForm.jsx'

export default function App() {
  // ── State ──────────────────────────────────────────────────
  const [categories, setCategories]       = useState([])
  const [products, setProducts]           = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [loading, setLoading]             = useState(true)
  const [toast, setToast]                 = useState('')  // pesan sukses

  // ── Load data saat pertama kali komponen di-mount ──────────
  // useEffect dengan [] = jalankan sekali setelah render pertama
  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [catData, prodData] = await Promise.all([
        getCategories(),
        getProducts(),
      ])
      setCategories(catData)
      setProducts(prodData)
    } catch (err) {
      console.error('Gagal load data:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Handler: tambah produk ─────────────────────────────────
  async function handleAdd(data) {
    const newProduct = await createProduct(data)
    // Tambah ke state lokal tanpa fetch ulang (optimistic update)
    setProducts(prev => [newProduct, ...prev])
    showToast(`✓ "${newProduct.name}" berhasil ditambahkan!`)
  }

  // ── Handler: hapus produk ──────────────────────────────────
  async function handleDelete(id, name) {
    if (!window.confirm(`Hapus "${name}"?`)) return
    await deleteProduct(id)
    // Buang dari state lokal
    setProducts(prev => prev.filter(p => p.id !== id))
    showToast(`✓ "${name}" berhasil dihapus.`)
  }

  // ── Helper: tampilkan toast sebentar ───────────────────────
  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  // ── Filter produk berdasarkan kategori aktif ───────────────
  const filteredProducts = activeCategoryId === null
    ? products
    : products.filter(p => p.categoryId === activeCategoryId)

  // ════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: 28 }}>

        {/* Toast notifikasi */}
        {toast && (
          <div className="card-panel teal lighten-5 teal-text text-darken-3"
            style={{ padding: '10px 16px', marginBottom: 16 }}>
            {toast}
          </div>
        )}

        {/* Form tambah produk */}
        <AddProductForm categories={categories} onAdd={handleAdd} />

        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h6 style={{ margin: 0, color: '#1565c0', fontWeight: 600 }}>
              Produk
              <span style={{ color: '#9e9e9e', fontWeight: 400, marginLeft: 8 }}>
                ({filteredProducts.length})
              </span>
            </h6>
            <button
              className="btn-flat btn-small blue-text"
              onClick={loadAll}
              disabled={loading}
            >
              <i className="material-icons tiny" style={{ verticalAlign: 'middle', marginRight: 4 }}>refresh</i>
              Refresh
            </button>
          </div>

          {/* Filter kategori */}
          <CategoryFilter
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />

          {/* Loading state */}
          {loading && (
            <div className="center-align" style={{ padding: 40 }}>
              <div className="preloader-wrapper small active">
                <div className="spinner-layer spinner-blue-only">
                  <div className="circle-clipper left"><div className="circle"></div></div>
                  <div className="gap-patch"><div className="circle"></div></div>
                  <div className="circle-clipper right"><div className="circle"></div></div>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          {!loading && filteredProducts.length === 0 && (
            <div className="center-align grey-text" style={{ padding: 40 }}>
              <i className="material-icons large">inventory_2</i>
              <p>Belum ada produk di kategori ini.</p>
            </div>
          )}

          {!loading && (
            <div className="row">
              {filteredProducts.map(product => (
                <div key={product.id} className="col s12 m6 l4">
                  <ProductCard product={product} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
