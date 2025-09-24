export default function Newsletter() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <h3 className="text-lg font-semibold">Keep in touch</h3>
      <p className="text-sm text-gray-600 mt-1">Sign up to receive updates and offers.</p>
      <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input type="email" required placeholder="Your email" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">Subscribe</button>
      </form>
    </div>
  )
}




