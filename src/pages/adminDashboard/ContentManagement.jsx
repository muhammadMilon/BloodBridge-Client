import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
import useRole from "../../hooks/useRole";
import Swal from "sweetalert2";
import PageTitle from "../../components/PageTitle";

const ContentManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  user.role = role;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosSecure.get("/get-blogs");
        setBlogs(res.data);
      } catch (err) {
        toast.error("Failed to load blogs");
      }
    };
    fetchBlogs();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch("/update-blog-status", {
        id,
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(
          `Blog ${
            newStatus === "published" ? "published" : "unpublished"
          } successfully`
        );

        // Update the status locally
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        toast.error("No changes made");
      }
    } catch (error) {
      toast.error("Failed to update blog status");
    }
  };

  const handleDeleteBlog = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/delete-blog/${id}`);
          if (res.data.deletedCount > 0) {
            toast.success("Blog deleted successfully");
            setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== id));

            Swal.fire("Deleted!", "The blog has been deleted.", "success");
          } else {
            Swal.fire("Oops!", "Failed to delete blog.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  const filteredBlogs = blogs.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="px-4 py-8 bg-slate-950 min-h-screen">
      <PageTitle title={"Content Management"} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Content Management
        </h1>
        <Link to="/admindashboard/content-management/add-blog">
          <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
            Add Blog
          </button>
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-slate-300">
          Filter by Status
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-xs border-2 border-slate-600 bg-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
        >
          <option value="all">All Blogs</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-700 hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-48 w-full object-cover rounded-lg mb-4 shadow-md"
            />
            <h2 className="text-lg font-bold mb-3 text-slate-200 line-clamp-2">
              {blog.title}
            </h2>
            <div className="mb-4">
              <span className="text-sm text-slate-400">Status: </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  blog.status === "published"
                    ? "bg-green-900/50 text-green-400 border border-green-700"
                    : "bg-yellow-900/50 text-yellow-400 border border-yellow-700"
                }`}
              >
                {blog.status}
              </span>
            </div>

            {/* Action Buttons for Admin */}
            {user?.role === "admin" && (
              <div className="flex flex-wrap gap-2 mt-3">
                {blog.status === "draft" ? (
                  <button
                    onClick={() => handleStatusChange(blog._id, "published")}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(blog._id, "draft")}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Unpublish
                  </button>
                )}

                <button
                  onClick={() => handleDeleteBlog(blog._id)}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;
