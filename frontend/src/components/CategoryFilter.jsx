// frontend/src/components/CategoryFilter.jsx
export default function CategoryFilter({ categories, activeId, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <a
        href="#!"
        className={`waves-effect waves-light btn-small ${activeId === null ? 'blue darken-4' : 'grey lighten-2 grey-text text-darken-2'}`}
        style={{ marginRight: 8, marginBottom: 8 }}
        onClick={() => onSelect(null)}
      >
        Semua
      </a>
      {categories.map(cat => (
        <a
          key={cat.id}
          href="#!"
          className={`waves-effect waves-light btn-small ${activeId === cat.id ? 'blue darken-4' : 'grey lighten-2 grey-text text-darken-2'}`}
          style={{ marginRight: 8, marginBottom: 8 }}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
          <span style={{ marginLeft: 6, opacity: 0.75 }}>
            ({cat._count?.products ?? 0})
          </span>
        </a>
      ))}
    </div>
  )
}
