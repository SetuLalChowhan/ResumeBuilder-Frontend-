import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/user/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllResumes(data.resumes);
      setIsLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.log(err);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post(
        "/resumes/create",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllResumes([...allResumes, data.resume]);
      toast.success(data.message);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.log(err);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(
        `/resumes/update`,
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllResumes(
        allResumes.map((r) => (r._id === editResumeId ? { ...r, title } : r))
      );
      setTitle("");
      toast.success(data.message);
      setEditResumeId("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.log(err);
    }
  };

  const deleteResume = async (resumeId) => {
    
    try {
      const { data } = await api.delete(
        `/resumes/delete/${resumeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllResumes(allResumes.filter((r) => r._id !== resumeId));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.log(err);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
        Welcome, {user?.name || "Joe Doe"}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusIcon className="w-11 h-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
            Create Resume
          </p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <UploadCloudIcon className="w-11 h-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
            Upload Existing
          </p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes?.map((resume, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <button
              key={index}
              onClick={() => navigate(`/app/builder/${resume?._id}`)}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + "40",
              }}
            >
              <FilePenLineIcon
                className="w-7 h-7 group-hover:scale-105 transition-all"
                style={{ color: baseColor }}
              />
              <p
                className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                style={{ color: baseColor }}
              >
                {resume?.title}
              </p>

              <p
                className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                style={{ color: baseColor + "90" }}
              >
                Updated on {new Date(resume?.updatedAt).toLocaleDateString()}
              </p>

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-1 right-1 flex items-center n"
              >
                <TrashIcon
                  onClick={() => deleteResume(resume?._id)}
                  className="w-7 h-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume?._id);
                    setTitle(resume.title);
                  }}
                  className="w-7 h-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Create Resume Modal */}
      {showCreateResume && (
        <form
          onSubmit={createResume}
          onClick={() => setShowCreateResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Enter Resume Title"
              className="w-full px-4 py-2 mb-4 border focus:border-green-600 ring-green-600 rounded"
              required
            />
            <button
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              type="submit"
            >
              Create Resume
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          onClick={() => setShowUploadResume(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Enter Resume Title"
              className="w-full px-4 py-2 mb-4 border focus:border-green-600 ring-green-600 rounded"
              required
            />

            <label
              htmlFor="resume-input"
              className="block text-sm text-slate-700"
            >
              Select Resume File
              <div className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-4 py-10 my-4 text-slate-400 hover:border-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                {resume ? (
                  <p className="text-gray-700">{resume.name}</p>
                ) : (
                  <>
                    <UploadCloudIcon className="w-14 h-14 stroke-1" />
                    <p>Upload Resume</p>
                  </>
                )}
              </div>
            </label>
            <input
              onChange={(e) => setResume(e.target.files[0])}
              type="file"
              id="resume-input"
              accept=".pdf"
              hidden
            />

            <button
            disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              type="submit"
            >
              {isLoading ? "Uploading..." : "Upload Resume"}
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setShowUploadResume(false);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}

      {/* Edit Resume Modal */}
      {editResumeId && (
        <form
          onSubmit={editTitle}
          onClick={() => setEditResumeId("")}
          className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Enter Resume Title"
              className="w-full px-4 py-2 mb-4 border focus:border-green-600 ring-green-600 rounded"
              required
            />
            <button
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              type="submit"
            >
              Update
            </button>
            <XIcon
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
