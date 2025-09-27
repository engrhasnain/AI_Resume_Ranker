import React, { useEffect, useState } from "react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null); // Track job being edited

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const res = await fetch("http://127.0.0.1:8000/jobs");
    const data = await res.json();
    setJobs(data.jobs);
  }

  async function addJob(e) {
    e.preventDefault();
    if (editId) {
      // Update job
      await fetch(`http://127.0.0.1:8000/updatejob/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      setEditId(null);
    } else {
      // Add new job
      await fetch("http://127.0.0.1:8000/addjobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
    }
    setTitle("");
    setDescription("");
    fetchJobs();
  }

  async function deleteJob(id) {
    await fetch(`http://127.0.0.1:8000/deletejob/${id}`, {
      method: "DELETE",
    });
    fetchJobs();
  }

  function startEdit(job) {
    setEditId(job.id);
    setTitle(job.title);
    setDescription(job.description);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {editId ? "Update Job" : "Available Jobs"}
      </h1>

      {/* Add / Edit Job Form */}
      <form onSubmit={addJob} className="mb-6 space-y-4 bg-gray-50 p-4 rounded shadow">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
