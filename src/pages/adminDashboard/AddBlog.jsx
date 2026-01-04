// src/pages/dashboard/AddBlog.jsx
import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import PageTitle from "../../components/PageTitle";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    content: "",
  });
  const editor = useRef(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic field validation
    if (!formData.title || !formData.thumbnail || !formData.content) {
      return toast.error("All fields are required");
    }

    try {
      const blogData = {
        ...formData,
        status: "draft", // always store as draft by default
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/add-blog", blogData);

      if (res.data.insertedId || res.data.acknowledged) {
        toast.success("Blog created successfully as draft");
        navigate("/admindashboard/content-management");
      }
    } catch (err) {
      toast.error("Failed to create blog");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-slate-950 min-h-screen">
      <PageTitle title={"Add Blog"} />
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Add New Blog
      </h2>
      <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 space-y-6">
        {/* Title input */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border-2 border-slate-600 bg-slate-700 text-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            required
          />
        </div>

        {/* Image URL input */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Thumbnail Image URL
          </label>
          <input
            type="text"
            name="thumbnail"
            placeholder="https://example.com/image.jpg"
            value={formData.thumbnail}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            className="w-full border-2 border-slate-600 bg-slate-700 text-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            required
          />
        </div>

        {/* Preview thumbnail if provided */}
        {formData.thumbnail && (
          <div className="flex justify-center">
            <img
              src={formData.thumbnail}
              alt="Thumbnail Preview"
              className="max-w-xs h-auto rounded-lg shadow-md border-2 border-slate-600"
            />
          </div>
        )}

        {/* Rich text editor for blog content */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Blog Content
          </label>
          <div className="border-2 border-slate-600 rounded-lg overflow-hidden">
            <JoditEditor
              ref={editor}
              value={formData.content}
              onChange={(newContent) =>
                setFormData({ ...formData, content: newContent })
              }
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
