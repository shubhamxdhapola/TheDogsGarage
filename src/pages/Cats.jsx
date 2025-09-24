import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import BuyNowModal from '../components/BuyNowModal'

const cats = [
  { name: 'Persian', description: 'Sweet and gentle companion.', image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Siamese', description: 'Elegant and intelligent talker.', image: 'https://images.unsplash.com/photo-1553322395-0f502ce22270?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Maine Coon', description: 'Gentle giant with a friendly nature.', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1200&auto=format&fit=crop' },
]

export default function Cats() {
  const [modal, setModal] = useState({ open: false, breed: undefined })
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cats</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cats.map((p) => (
          <ProductCard key={p.name} {...p} onBuy={() => setModal({ open: true, breed: p.name })} />
        ))}
      </div>
      <BuyNowModal open={modal.open} onClose={() => setModal({ open: false })} defaultCategory="cat" defaultBreed={modal.breed} />
    </div>
  )
}


