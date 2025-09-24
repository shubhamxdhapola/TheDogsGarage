import axios from "axios";
import { Loader, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const BREEDS = {
  dog: ["Labrador", "German Shepherd", "Poodle", "Bulldog", "Golden Retriever"],
  cat: ["Persian", "Siamese", "Maine Coon", "Bengal", "Ragdoll"],
};

export default function BuyNowModal({
  open,
  onClose,
  defaultCategory = "dog",
  defaultBreed,
}) {
  const initialFormData = {
    name: "",
    phone: "",
    email: "",
    address: "",
    category: "dog",
    breed: "",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const breeds = useMemo(() => BREEDS[category] || [], [category]);
  const [breed, setBreed] = useState(defaultBreed || breeds[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setBreed((b) => (breeds.includes(b) ? b : breeds[0]));
  }, [breeds]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("https://api.web3forms.com/submit", {
        ...{ name, email, number, address, category, breed },
        access_key: import.meta.env.VITE_PUBLIC_ACCESS_KEY,
      });
      toast.success("Order placed successfully");
    } catch (error) {
      toast.error("Unable to send message");
      console.log("Error in submitting form : ", error);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4 overflow-y-scroll">
        <form
          onSubmit={submit}
          className="w-full max-w-lg border border-gray-200 bg-white p-5 sm:p-6 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Buy Now</h3>
              <p className="mt-1">Enter your details to order</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer  duration-300"
            >
              ✕
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full  border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Phone</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                className="mt-1 w-full  border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full  border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-gray-700">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="mt-1 w-full  border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex gap-4 justify-center items-center sm:col-span-2">
              <div className="flex-1">
                <label className="text-sm text-gray-700">Pet Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full  border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-700">Breed</label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="mt-1 w-full  border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {breeds.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2  border border-black text-gray-800 hover:bg-gray-50 flex-1"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-black text-white hover:bg-black/80 flex-1 border border-black"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
