import { useState } from 'react'

function Item({ q, a, open, onToggle }) {
  return (
    <div className='border-b border-gray-200'>
      <button
        className="w-full flex items-center justify-between py-3 text-left group focus:outline-none"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="font-medium text-gray-900">{q}</span>
        <svg
          className={`ml-4 h-5 w-5 text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-gray-700">
            <p className="text-sm leading-6">{a}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const faqs = [
    { q: 'Do you provide grooming for both cats and dogs?', a: 'Yes, we offer full grooming services for both cats and dogs by appointment.' },
    { q: 'Do you offer home delivery for products?', a: 'Yes, we provide local delivery. Delivery time is typically 1–2 business days.' },
    { q: 'What is your return policy?', a: 'Unopened items can be returned within 7 days with a receipt for a full refund.' },
    { q: 'How can I book a dog walk?', a: 'Call us or email hello@petstore.test and we will confirm your preferred time slot.' },
  ]

  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="border border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
        <div>
          {faqs.map((f, i) => (
            <Item
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}




