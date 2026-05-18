import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, FieldArray } from "formik";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const tabs = ["skills", "projects", "profile"];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

        {/* ===== Tabs ===== */}
        <div className="mb-8">
          <div className="flex justify-center gap-10 border-b border-gray-200 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative text-lg capitalize transition ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 -bottom-[6px] w-full h-[2px] bg-blue-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= SKILLS ================= */}
        {activeTab === "skills" && (
          <Formik
            initialValues={{ title: "", skills: [""] }}
            onSubmit={async (values, { resetForm }) => {
              const data = {
                title: values.title,
                skills: values.skills.filter((s) => s.trim() !== ""),
              };

              try {
                const res = await axios.post(
                  `${import.meta.env.VITE_BACKED_URL}/api/admin`,
                  data,
                );
                console.log(res.data);
                resetForm();
              } catch (error) {
                console.error(error.response?.data || error.message);
              }
            }}
          >
            {({ values }) => (
              <Form className="space-y-4">
                <Field
                  name="title"
                  placeholder="Category (Frontend)"
                  className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />

                <FieldArray name="skills">
                  {({ push, remove }) => (
                    <div className="space-y-3">
                      {values.skills.map((_, index) => (
                        <div key={index} className="flex gap-2">
                          <Field
                            name={`skills.${index}`}
                            placeholder={`Skill ${index + 1}`}
                            className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                          />

                          {values.skills.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="px-3 bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                              X
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => push("")}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                      >
                        + Add Skill
                      </button>
                    </div>
                  )}
                </FieldArray>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                  Submit Skills
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* ================= PROJECTS ================= */}
        {activeTab === "projects" && (
  <Formik
  initialValues={{
    title: "",
    description: "",
    liveLink: "",
    githubLink: "",
    image: null,
  }}
  onSubmit={async (values, { resetForm }) => {
    if (!values.image) {
      alert("Please upload image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("liveLink", values.liveLink);
      formData.append("githubLink", values.githubLink);
      formData.append("image", values.image);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKED_URL}/api/admin/projects`,
        formData
      );

      console.log("SUCCESS:", res.data);
      alert("Project Added ✅");

      resetForm();

    } catch (error) {
      console.log("ERROR:", error.response?.data);
    }
  }}
>
  {({ setFieldValue, values }) => (
    <Form className="space-y-4">

      <Field
        name="title"
        placeholder="Project Title"
        className="w-full p-3 bg-gray-100 rounded-lg"
      />

      <Field
        name="description"
        placeholder="Description"
        className="w-full p-3 bg-gray-100 rounded-lg"
      />

      <Field
        name="liveLink"
        placeholder="Live Demo URL"
        className="w-full p-3 bg-gray-100 rounded-lg"
      />

      <Field
        name="githubLink"
        placeholder="GitHub URL"
        className="w-full p-3 bg-gray-100 rounded-lg"
      />

      <input
        type="file"
        onChange={(e) =>
          setFieldValue("image", e.target.files[0])
        }
      />

      {values.image && (
        <img
          src={URL.createObjectURL(values.image)}
          alt="preview"
          className="w-full h-44 object-cover rounded-lg"
        />
      )}

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
        Submit Project
      </button>

    </Form>
  )}
</Formik>
        )}

        {/* ================= PROFILE ================= */}
        {activeTab === "profile" && (
          <Formik
            initialValues={{ banner: null }}
            onSubmit={async (values, { resetForm }) => {
              try {
                const formData = new FormData();
                formData.append("banner", values.banner);

                const res = await axios.post(
                  `${import.meta.env.VITE_BACKED_URL}/api/admin/banner`,
                  formData,
                );

                console.log(res.data);
                resetForm();
              } catch (error) {
                console.error(error.response?.data || error.message);
              }
            }}
          >
            {({ setFieldValue, values }) => (
              <Form className="space-y-4">
                <h2 className="text-lg font-semibold">Upload Banner Image</h2>

                {/* 🔥 Styled File Upload */}
                <div className="space-y-3">
                  <input
                    type="file"
                    id="bannerUpload"
                    className="hidden"
                    onChange={(e) => setFieldValue("banner", e.target.files[0])}
                  />

                  <label
                    htmlFor="bannerUpload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <span className="text-gray-500">
                      Click to upload banner image
                    </span>
                    <span className="text-sm text-gray-400">
                      Recommended: Wide image
                    </span>
                  </label>
                </div>

                {values.banner && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {values.banner.name}
                    </p>
                    <img
                      src={URL.createObjectURL(values.banner)}
                      alt="banner preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                  Upload Banner
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
