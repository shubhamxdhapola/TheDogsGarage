export default function CategoryCard({ title, image, href, accent = 'blue' }) {
  const accentClasses = accent === 'pink'
    ? 'bg-pink-50 text-pink-700 ring-pink-200 hover:ring-pink-300'
    : 'bg-amber-50 text-amber-700 ring-amber-200 hover:ring-amber-300'

  return (
    <a href={href} className={`group block overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-shadow`}>
      {image && (
        <img src={image} alt={title} className="w-full h-44 object-cover" />
      )}
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ring-1 ${accentClasses}`}>Shop</span>
      </div>
    </a>
  )
}




