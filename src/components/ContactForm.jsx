import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactForm() {

  const initialFormData = {
    name: "",
    email: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("https://api.web3forms.com/submit", {
        ...formData,
        access_key: import.meta.env.VITE_PUBLIC_ACCESS_KEY,
      });
      toast.success("Message sent successfully");
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Unable to send message");
      console.log("Error in submitting form : ", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="border border-gray-500 bg-white p-5 sm:p-6 mx-auto"
    >
      <h3 className="text-lg font-semibold">Get in Touch</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-800">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleOnChange}
            required
            className="mt-1 w-full border border-gray-500 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label className="text-sm text-gray-800">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleOnChange}
            required
            className="mt-1 w-full border border-gray-500 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-gray-800">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleOnChange}
            rows={3}
            required
            className="mt-1 w-full border border-gray-500 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          className={` w-full px-4 py-2 ${
            submitting
              ? "bg-black/80 cursor-not-allowed"
              : "bg-black cursor-pointer"
          } border-gray-500 border text-white hover:bg-black/80 duration-300`}
          disabled={submitting}
        >
          {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Send"}
        </button>
      </div>
    </form>
  );
}
