export default function ContactForm() {
  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    alert(`Thanks ${data.name}, we will contact you at ${data.email}.`);
    form.reset();
  };

  return (
    <form
      onSubmit={submit}
      className="rounded border border-gray-200 bg-white p-5 sm:p-6  mx-auto"
    >
      <h3 className="text-lg font-semibold">Get in Touch</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-700">Name</label>
          <input
            name="name"
            required
            className="mt-1 w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-gray-700">Message</label>
          <textarea
            name="message"
            rows={4}
            required
            className="mt-1 w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      <div className="mt-4">
        <button className="cursor-pointer w-full px-4 py-2 bg-black text-white hover:bg-black/80 duration-300">
          Send
        </button>
      </div>
    </form>
  );
}
