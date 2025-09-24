import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import BuyNowModal from '../components/BuyNowModal'

const dogs = [
  { name: 'Labrador', description: 'Friendly and outgoing family dog.', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200&auto=format&fit=crop' },
  { name: 'German Shepherd', description: 'Confident, courageous, and smart.', image: 'https://images.unsplash.com/photo-1517821099601-1aeb1bfee683?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Poodle', description: 'Active, proud, and very smart.', image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1200&auto=format&fit=crop' },
]

export default function Dogs() {
  const [modal, setModal] = useState({ open: false, breed: undefined })
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map((p) => (
          <ProductCard key={p.name} {...p} onBuy={() => setModal({ open: true, breed: p.name })} />
        ))}
      </div>
      <BuyNowModal open={modal.open} onClose={() => setModal({ open: false })} defaultCategory="dog" defaultBreed={modal.breed} />
    </div>
  )
}


