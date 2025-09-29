import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  // -------------------------
  // INIT
  // -------------------------
  useEffect(() => {
    fetchJobs();
    fetchResumes();
    // Supabase auth state
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, sess) => setSession(sess)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // -------------------------
  // FASTAPI CALLS
  // -------------------------
  async function fetchJobs() {
    const res = await fetch("http://127.0.0.1:8000/jobs");
    const data = await res.json();
    setJobs(data.jobs);
  }

  async function fetchResumes() {
    // In real case you might filter by session.user.id
    const res = await fetch("http://127.0.0.1:8000/resumes");
    const data = await res.json();
    setResumes(data.resumes || []);
  }

  async function addJob(e) {
    e.preventDefault();
    const body = JSON.stringify({ title, description });
    if (editId) {
      await fetch(`http://127.0.0.1:8000/updatejob/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      });
      setEditId(null);
    } else {
      await fetch("http://127.0.0.1:8000/addjobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
    }
    setTitle("");
    setDescription("");
    fetchJobs();
  }

  async function deleteJob(id) {
    await fetch(`http://127.0.0.1:8000/deletejob/${id}`, { method: "DELETE" });
    fetchJobs();
  }

  function startEdit(job) {
    setEditId(job.id);
    setTitle(job.title);
    setDescription(job.description);
  }

  function openApplyForm(job) {
    if (!session) {
      alert("Please log in first!");
      return;
    }
    setSelectedJob(job);
    setShowApplyForm(true);
  }

  async function submitApplication(e) {
    e.preventDefault();
    if (!session) return alert("You must be logged in to apply!");

    await fetch("http://127.0.0.1:8000/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: session.user.id,
        job_id: selectedJob.id,
        resume_id: selectedResumeId,
        cover_letter: coverLetter,
      }),
    });

    alert("Application submitted!");
    setShowApplyForm(false);
    setCoverLetter("");
    setSelectedResumeId("");
  }

  // -------------------------
  // SUPABASE AUTH
  // -------------------------
  async function handleAuth(e) {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
      });
      if (error) alert(error.message);
      else alert("Check your email for confirmation!");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {editId ? "Update Job" : "Available Jobs"}
      </h1>

      {/* AUTH BOX */}
      {!session && (
        <form
          onSubmit={handleAuth}
          className="mb-6 bg-gray-50 p-4 rounded shadow space-y-3"
        >
          <h2 className="font-semibold text-lg">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <input
            className="border p-2 w-full rounded"
            placeholder="Email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 underline w-full"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
        </form>
      )}

      {session && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-700">Logged in as {session.user.email}</p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Add/Edit Job Form */}
      <form
        onSubmit={addJob}
        className="mb-6 space-y-4 bg-gray-50 p-4 rounded shadow"
      >
        <input
          className="border p-2 w-full rounded"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editId ? "Update Job" : "Add Job"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setTitle("");
                setDescription("");
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Job List */}
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="p-4 bg-white shadow rounded flex justify-between items-start"
          >
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-700">{job.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEdit(job)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteJob(job.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => openApplyForm(job)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Apply
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Application Form Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={submitApplication}
            className="bg-white p-6 rounded shadow-md w-96 space-y-4"
          >
            <h2 className="text-xl font-bold mb-2">
              Apply for: {selectedJob.title}
            </h2>

            {/* Resume Selector */}
            <select
              className="border p-2 w-full rounded"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              required
            >
              <option value="">Select Resume</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Cover Letter */}
            <textarea
              className="border p-2 w-full rounded"
              placeholder="Cover Letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
