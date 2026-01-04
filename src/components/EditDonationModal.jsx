import React, { useState } from "react";
import useAxiosPublic from "../hooks/axiosPublic";

export default function EditDonationModal({ editData, onClose, refetch }) {
  const axiosPublic = useAxiosPublic();
  const [formData, setFormData] = useState(editData || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosPublic.put(
        `/update-donation-request/${formData._id}`,
        formData
      );
      if (res.data.modifiedCount > 0) {
        alert("Donation request updated successfully.");
        onClose();
        refetch(); // optional, if you're using React Query or similar
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h3 className="text-xl font-semibold mb-4 text-center">Edit Request</h3>

        <input
          type="text"
          name="recipientName"
          value={formData.recipientName || ""}
          onChange={handleChange}
          placeholder="Recipient Name"
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          name="recipientDistrict"
          value={formData.recipientDistrict || ""}
          onChange={handleChange}
          placeholder="District"
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          name="bloodGroup"
          value={formData.bloodGroup || ""}
          onChange={handleChange}
          placeholder="Blood Group"
          className="w-full border p-2 rounded mb-2"
        />
        {/* Add more fields as needed */}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
