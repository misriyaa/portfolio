import React, { useState, useEffect } from "react";
import api, { resolveImageUrl, API_BASE_URL } from "../config/api";
import { Formik, Form, Field, FieldArray } from "formik";
import { Trash2, Edit3, Image as ImageIcon, RefreshCw, CheckCircle, AlertCircle, X } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const tabs = ["skills", "projects", "profile", "contact", "messages"];

  // Global feedback notification
  const [notification, setNotification] = useState({ type: "", message: "" });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 5000);
  };

  // ================= SKILLS STATE =================
  const [skillsList, setSkillsList] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null); // When editing a category

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      let res;
      try {
        res = await api.get("/api/admin");
      } catch (err1) {
        if (err1.response?.status === 404) {
          res = await api.get("/api/admin/skills");
        } else {
          throw err1;
        }
      }
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setSkillsList(list);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      const msg = err.response?.data?.message || (err.code === "ERR_NETWORK" ? "Cannot connect to backend server." : "Failed to load skills from database.");
      showNotification("error", msg);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleDeleteSkill = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      let res;
      try {
        res = await api.delete(`/api/admin/skills/${id}`);
      } catch (delErr) {
        if (delErr.response?.status === 404) {
          res = await api.delete(`/api/admin/${id}`);
        } else {
          throw delErr;
        }
      }
      showNotification("success", res.data?.message || "Skill category deleted.");
      setSkillsList((prev) => prev.filter((s) => s._id !== id));
      if (editingSkill?._id === id) setEditingSkill(null);
    } catch (err) {
      console.error("Failed to delete skill:", err);
      showNotification("error", err.response?.data?.message || "Failed to delete skill.");
    }
  };

  // ================= PROJECTS STATE =================
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await api.get("/api/admin/projects");
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setProjectsList(list);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      showNotification("error", "Failed to load projects from database.");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      const res = await api.delete(`/api/admin/projects/${id}`);
      showNotification("success", res.data?.message || "Project deleted successfully.");
      setProjectsList((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      showNotification("error", err.response?.data?.message || "Failed to delete project.");
    }
  };

  // ================= PROFILE & BANNER STATE =================
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get("/api/profile");
      if (res.data?.data) {
        setCurrentProfile(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      showNotification("error", "Failed to load profile details.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // ================= VISITOR MESSAGES STATE =================
  const [messagesList, setMessagesList] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await api.get("/api/admin/messages");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setMessagesList(list);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await api.delete(`/api/admin/messages/${id}`);
      showNotification("success", res.data?.message || "Message deleted.");
      setMessagesList((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
      showNotification("error", "Failed to delete message.");
    }
  };

  // Fetch initial content when tab switches
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        if (activeTab === "skills") {
          let res;
          try {
            res = await api.get("/api/admin");
          } catch (e1) {
            if (e1.response?.status === 404) {
              res = await api.get("/api/admin/skills");
            } else {
              throw e1;
            }
          }
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          if (active) setSkillsList(list);
        } else if (activeTab === "projects") {
          const res = await api.get("/api/admin/projects");
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          if (active) setProjectsList(list);
        } else if (activeTab === "profile" || activeTab === "contact") {
          const res = await api.get("/api/profile");
          if (active && res.data?.data) {
            setCurrentProfile(res.data.data);
          }
        } else if (activeTab === "messages") {
          const res = await api.get("/api/admin/messages");
          const list = Array.isArray(res.data?.data) ? res.data.data : [];
          if (active) setMessagesList(list);
        }
      } catch (err) {
        console.error("Error fetching data for tab:", activeTab, err);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 md:p-8 flex justify-center font-sans">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-md border border-gray-100">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage permanent content stored in MongoDB & Cloudinary</p>
          </div>
          <a
            href="/"
            className="text-xs uppercase tracking-widest font-bold px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            ← View Portfolio
          </a>
        </div>

        {/* Global Notification */}
        {notification.message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm font-semibold transition-all ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification({ type: "", message: "" })}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ===== Tabs ===== */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-6 sm:gap-10 border-b border-gray-200 pb-2 whitespace-nowrap min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setEditingSkill(null);
                }}
                className={`relative text-base sm:text-lg capitalize font-medium transition py-1 ${
                  activeTab === tab
                    ? "text-blue-600 font-bold"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab === "profile" ? "Banner" : tab}
                {activeTab === tab && (
                  <span className="absolute left-0 -bottom-[10px] w-full h-[2.5px] bg-blue-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= SKILLS TAB ================= */}
        {activeTab === "skills" && (
          <div className="space-y-10">
            {/* Form */}
            <div className="bg-gray-50/70 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  {editingSkill ? `Edit Category: ${editingSkill.title}` : "Add New Skill Category"}
                </h2>
                {editingSkill && (
                  <button
                    type="button"
                    onClick={() => setEditingSkill(null)}
                    className="text-xs text-gray-500 hover:text-gray-800 underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <Formik
                enableReinitialize
                initialValues={{
                  title: editingSkill ? editingSkill.title : "",
                  skills: editingSkill ? editingSkill.skills : [""],
                }}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  const data = {
                    title: values.title?.trim(),
                    skills: (values.skills || []).map((s) => String(s).trim()).filter(Boolean),
                  };

                  if (!data.title || data.skills.length === 0) {
                    showNotification("error", "Category title and at least one skill are required.");
                    setSubmitting(false);
                    return;
                  }

                  try {
                    let res;
                    if (editingSkill) {
                      try {
                        res = await api.put(`/api/admin/skills/${editingSkill._id}`, data);
                      } catch (err1) {
                        if (err1.response?.status === 404) {
                          res = await api.put(`/api/admin/${editingSkill._id}`, data);
                        } else {
                          throw err1;
                        }
                      }
                      showNotification("success", res.data?.message || "Skill category updated!");
                      setEditingSkill(null);
                    } else {
                      try {
                        res = await api.post("/api/admin", data);
                      } catch (err1) {
                        if (err1.response?.status === 404) {
                          res = await api.post("/api/admin/skills", data);
                        } else {
                          throw err1;
                        }
                      }
                      showNotification("success", res.data?.message || "Skill category saved to MongoDB!");
                    }
                    resetForm();
                    fetchSkills();
                  } catch (error) {
                    console.error("Save skill error:", error);
                    const serverMsg = error.response?.data?.message;
                    let displayMsg = serverMsg;
                    if (!displayMsg) {
                      if (!error.response || error.code === "ERR_NETWORK") {
                        displayMsg = `Cannot connect to backend server (${API_BASE_URL}). Please verify that your backend is running ('npm run dev' on port 5000).`;
                      } else if (error.response?.status === 404) {
                        displayMsg = "Save skill API route not found (404). Please ensure the backend server is running.";
                      } else {
                        displayMsg = error.message || "Failed to save skill.";
                      }
                    }
                    showNotification("error", displayMsg);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Category Title
                      </label>
                      <Field
                        name="title"
                        placeholder="e.g. Frontend, Backend, Database"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Skills
                      </label>
                      <FieldArray name="skills">
                        {({ push, remove }) => (
                          <div className="space-y-3">
                            {values.skills.map((_, index) => (
                              <div key={index} className="flex gap-2">
                                <Field
                                  name={`skills.${index}`}
                                  placeholder={`Skill name (e.g. React.js)`}
                                  className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />

                                {values.skills.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="px-3 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-lg transition"
                                    title="Remove this skill"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => push("")}
                              className="text-xs font-bold bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition"
                            >
                              + Add Another Skill
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm transition shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Saving to Database..."
                        : editingSkill
                        ? "Update Skill Category"
                        : "Save Skill Category"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            {/* Existing Skills List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
                  Saved Categories ({skillsList.length})
                </h3>
                <button
                  onClick={fetchSkills}
                  disabled={loadingSkills}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 font-semibold"
                >
                  <RefreshCw size={12} className={loadingSkills ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {loadingSkills ? (
                <div className="p-8 text-center text-sm text-gray-400">Loading saved skills...</div>
              ) : skillsList.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No skills in database yet. Add your first category above!
                </div>
              ) : (
                <div className="space-y-3">
                  {skillsList.map((cat) => (
                    <div
                      key={cat._id}
                      className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-base">{cat.title}</span>
                          <span className="text-xs text-gray-400 font-mono">
                            ({cat.skills?.length || 0} skills)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(cat.skills || []).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setEditingSkill(cat);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="Edit Category"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(cat._id, cat.title)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="Delete Category"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === "projects" && (
          <div className="space-y-10">
            {/* Form */}
            <div className="bg-gray-50/70 p-6 rounded-xl border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Add New Project</h2>

              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  liveLink: "",
                  githubLink: "",
                  image: null,
                }}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  if (!values.title.trim()) {
                    showNotification("error", "Project title is required.");
                    setSubmitting(false);
                    return;
                  }

                  if (!values.image) {
                    showNotification("error", "Please select a project screenshot/image.");
                    setSubmitting(false);
                    return;
                  }

                  try {
                    const formData = new FormData();
                    formData.append("title", values.title.trim());
                    formData.append("description", values.description.trim());
                    formData.append("liveLink", values.liveLink.trim());
                    formData.append("githubLink", values.githubLink.trim());
                    formData.append("image", values.image);

                    const res = await api.post("/api/admin/projects", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });

                    showNotification(
                      "success",
                      res.data?.message || "Project uploaded to Cloudinary & saved in MongoDB!"
                    );

                    resetForm();
                    fetchProjects();
                  } catch (error) {
                    console.error("Project submit error:", error);
                    showNotification(
                      "error",
                      error.response?.data?.message || "Failed to create project."
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ setFieldValue, values, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Project Title *
                      </label>
                      <Field
                        name="title"
                        placeholder="e.g. QuickShow Movie Booking"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={3}
                        placeholder="Brief overview of features, tech stack..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                          Live Demo URL
                        </label>
                        <Field
                          name="liveLink"
                          placeholder="https://example.com"
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                          GitHub Repository URL
                        </label>
                        <Field
                          name="githubLink"
                          placeholder="https://github.com/..."
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Project Image * (Uploads permanently to Cloudinary)
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => setFieldValue("image", e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>

                    {values.image && (
                      <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
                        <span className="text-xs text-gray-500 font-medium">Selected Preview:</span>
                        <img
                          src={URL.createObjectURL(values.image)}
                          alt="preview"
                          className="w-full h-44 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm transition shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Uploading Image to Cloudinary & Saving..." : "Submit Project"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            {/* Existing Projects List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
                  Saved Projects ({projectsList.length})
                </h3>
                <button
                  onClick={fetchProjects}
                  disabled={loadingProjects}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 font-semibold"
                >
                  <RefreshCw size={12} className={loadingProjects ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {loadingProjects ? (
                <div className="p-8 text-center text-sm text-gray-400">Loading saved projects...</div>
              ) : projectsList.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No projects in database yet. Add your first project above!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectsList.map((proj) => (
                    <div
                      key={proj._id}
                      className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col justify-between hover:border-gray-300 transition"
                    >
                      <div className="space-y-3">
                        <div className="h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                          <img
                            src={resolveImageUrl(proj.image)}
                            alt={proj.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%239ca3af%22%20font-size%3D%2214%22%20font-family%3D%22sans-serif%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EProject%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-gray-900 text-base">{proj.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {proj.description || "No description provided."}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex gap-2 text-xs">
                          {proj.liveLink && (
                            <a
                              href={proj.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              Live ↗
                            </a>
                          )}
                          {proj.githubLink && (
                            <a
                              href={proj.githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-600 hover:underline font-semibold"
                            >
                              Code ↗
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteProject(proj._id, proj.title)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          title="Delete Project"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PROFILE / BANNER TAB ================= */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Active Banner Display */}
            <div className="bg-gray-50/70 p-6 rounded-xl border border-gray-200">
              <h2 className="text-lg font-bold mb-3">Active Portfolio Banner</h2>
              {loadingProfile ? (
                <div className="py-6 text-center text-sm text-gray-400">Loading current banner...</div>
              ) : currentProfile?.banner ? (
                <div className="space-y-3">
                  <div className="h-56 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
                    <img
                      src={resolveImageUrl(currentProfile.banner)}
                      alt="Active Banner"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = "flex";
                        }
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="hidden flex-col items-center justify-center p-6 text-center text-gray-400 text-xs">
                      <ImageIcon size={32} className="text-gray-300 mb-2" />
                      <p className="font-bold text-gray-500">Image file not found on disk or Cloudinary</p>
                      <p className="text-gray-400 mt-1">Please select an image file below to upload permanently to Cloudinary.</p>
                    </div>
                  </div>
                  {currentProfile.banner.startsWith("http") ? (
                    <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg flex items-center gap-2 border border-emerald-200">
                      <CheckCircle size={14} />
                      <span>Permanent Cloudinary HTTPS URL active in MongoDB.</span>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-lg flex items-center gap-2 border border-amber-200">
                      <AlertCircle size={14} />
                      <span>Notice: MongoDB currently holds a local filename ({currentProfile.banner}). Please upload a banner below to store permanently in Cloudinary.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
                  No active banner found in database. Upload one below!
                </div>
              )}
            </div>

            {/* Banner Upload Form */}
            <div className="bg-gray-50/70 p-6 rounded-xl border border-gray-200">
              <h3 className="text-base font-bold mb-4">Upload New Banner</h3>

              <Formik
                initialValues={{ banner: null }}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  if (!values.banner) {
                    showNotification("error", "Please select an image file to upload.");
                    setSubmitting(false);
                    return;
                  }

                  try {
                    const formData = new FormData();
                    formData.append("banner", values.banner);

                    const res = await api.post("/api/admin/banner", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });

                    showNotification(
                      "success",
                      res.data?.message || "Banner permanently uploaded to Cloudinary!"
                    );

                    resetForm();
                    fetchProfile();
                  } catch (error) {
                    console.error("Banner upload error:", error);
                    showNotification(
                      "error",
                      error.response?.data?.message || "Failed to upload banner."
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ setFieldValue, values, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-3">
                      <input
                        type="file"
                        id="bannerUpload"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="hidden"
                        onChange={(e) => setFieldValue("banner", e.target.files[0])}
                      />

                      <label
                        htmlFor="bannerUpload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 bg-white transition"
                      >
                        <ImageIcon size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm font-semibold text-gray-600">
                          Click to select a new banner image
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG, or WEBP (Saved permanently to Cloudinary)
                        </span>
                      </label>
                    </div>

                    {values.banner && (
                      <div className="space-y-2 p-3 bg-white border border-gray-200 rounded-xl">
                        <p className="text-xs text-gray-600 font-semibold">
                          Selected File: {values.banner.name}
                        </p>
                        <img
                          src={URL.createObjectURL(values.banner)}
                          alt="banner preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-100"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !values.banner}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm transition shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Uploading to Cloudinary & Saving..." : "Upload & Replace Banner"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* ================= CONTACT DETAILS TAB ================= */}
        {activeTab === "contact" && (
          <div className="space-y-8">
            <div className="bg-gray-50/70 p-6 rounded-xl border border-gray-200">
              <h2 className="text-lg font-bold mb-1">Portfolio Contact Information</h2>
              <p className="text-xs text-gray-500 mb-6">
                Update your contact details shown on the public Contact page and Footer.
              </p>

              <Formik
                enableReinitialize
                initialValues={{
                  email: currentProfile?.email || "misriya8784@gmail.com",
                  phone: currentProfile?.phone || "+91 8714945730",
                  location: currentProfile?.location || "Kerala, India",
                  github: currentProfile?.socialLinks?.github || "https://github.com/misriyaa",
                  linkedin: currentProfile?.socialLinks?.linkedin || "https://www.linkedin.com/in/nafeesathul-misriya-p/",
                  instagram: currentProfile?.socialLinks?.instagram || "#",
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const payload = {
                      email: values.email,
                      phone: values.phone,
                      location: values.location,
                      socialLinks: {
                        github: values.github,
                        linkedin: values.linkedin,
                        instagram: values.instagram,
                      },
                    };

                    const res = await api.put("/api/admin/profile", payload);
                    showNotification("success", res.data?.message || "Contact details updated!");
                    fetchProfile();
                  } catch (err) {
                    console.error("Failed to update contact info:", err);
                    showNotification("error", "Failed to update contact information.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                          Phone Number
                        </label>
                        <Field
                          name="phone"
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Location / Based In
                      </label>
                      <Field
                        name="location"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        Social Profile Links
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">GitHub URL</label>
                          <Field
                            name="github"
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">LinkedIn URL</label>
                          <Field
                            name="linkedin"
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Instagram URL</label>
                          <Field
                            name="instagram"
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm transition shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving Contact Details..." : "Save Contact Information"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* ================= VISITOR ENQUIRIES TAB ================= */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Visitor Contact Enquiries</h2>
                <p className="text-xs text-gray-500">Messages sent via public Contact form ({messagesList.length})</p>
              </div>
              <button
                onClick={fetchMessages}
                disabled={loadingMessages}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 font-semibold"
              >
                <RefreshCw size={12} className={loadingMessages ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {loadingMessages ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading enquiries...</div>
            ) : messagesList.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No visitor enquiries received yet. Form submissions on the Contact page will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {messagesList.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-5 bg-white border border-gray-200 rounded-xl space-y-3 hover:border-gray-300 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{msg.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">
                            {msg.email}
                          </a>
                          {msg.service && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                {msg.service}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-400 font-mono">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
