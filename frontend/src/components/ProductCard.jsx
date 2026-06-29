// frontend/src/components/ProductCard.jsx
export default function ProductCard({ product, onDelete }) {
  const isLowStock = product.stock < 10

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="card">
      <div className="card-content">
        {/* Category chip */}
        <span className="new badge blue darken-3" data-badge-caption="">
          {product.category?.name}
        </span>

        <span className="card-title" style={{ fontSize: 17, marginTop: 8, display: 'block' }}>
          {product.name}
        </span>

        <p className="blue-text darken-4" style={{ fontSize: 20, fontWeight: 700, margin: '4px 0' }}>
          {formatPrice(product.price)}
        </p>

        {/* Stock badge */}
        <span className={`badge ${isLowStock ? 'orange' : 'teal'} white-text`}
          style={{ float: 'none', display: 'inline-block', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>
          Stok: {product.stock}{isLowStock ? ' ⚠' : ''}
        </span>
      </div>

      <div className="card-action" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <a
          href="#!"
          className="red-text"
          onClick={() => onDelete(product.id, product.name)}
        >
          <i className="material-icons tiny" style={{ verticalAlign: 'middle', marginRight: 4 }}>delete</i>
          Hapus
        </a>
      </div>
    </div>
  )
}
