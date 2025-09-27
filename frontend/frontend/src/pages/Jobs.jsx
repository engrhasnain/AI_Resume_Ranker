import { useEffect, useState } from "react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs")  // ✅ Correct backend URL
      .then((res) => res.json())
      .then((data) => {
        console.log(data);              // 👈 Check if it logs your JSON
        setJobs(data.jobs || []);       // ✅ Access "jobs" array
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded bg-gray-100">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>{job.description}</p>
              <span className="text-sm text-gray-600">
                Posted: {new Date(job.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
