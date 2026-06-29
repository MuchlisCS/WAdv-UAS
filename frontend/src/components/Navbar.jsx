// frontend/src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav className="blue darken-4">
      <div className="nav-wrapper container">
        <a href="#" className="brand-logo">
          <i className="material-icons" style={{ marginRight: 8 }}>store</i>
          Product Catalog
        </a>
        <span className="right" style={{ lineHeight: '64px', opacity: 0.7, fontSize: 13 }}>
          P10 Demo — React + Express
        </span>
      </div>
    </nav>
  )
}
