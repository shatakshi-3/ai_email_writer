"use client";
import { useState } from "react";

export default function Home(){
  const [formData, setFormData] = useState({
    recipientName: "",
    companyName: "",
    purpose: "",
    tone: "professional",
    background: "",
  });

  const [loading, setLoading] = useState(false);

  const [generatedEmail, setGeneratedEmail] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);

    setGeneratedEmail("");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      setGeneratedEmail(data.email);
    } else {
      alert("Failed to generate email");
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  

  
return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          AI Email Writer
        </h1>

        <div className="space-y-4">
          {/* Recipient Name */}
          <div>
            <label className="block mb-1 font-medium">
              Recipient Name
            </label>

            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Enter recipient name"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block mb-1 font-medium">
              Company Name
            </label>

            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block mb-1 font-medium">
              Purpose
            </label>

            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Example: Recruiter outreach"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block mb-1 font-medium">
              Tone
            </label>

            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="confident">Confident</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          {/* Background */}
          <div>
            <label className="block mb-1 font-medium">
              Your Background
            </label>

            <textarea
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="Tell something about yourself..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
          >
            Generate Email
          </button>
        </div>
      </div>
    </main>
  );
}

