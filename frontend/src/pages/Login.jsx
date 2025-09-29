import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);

    const token = data?.session?.access_token;
    if (token) {
      // Upsert user on the backend (ensures public.users has a row)
      await fetch("http://127.0.0.1:8000/users/upsert", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      // redirect to jobs or profile
      nav("/jobs");
    } else {
      alert("Logged in, but no token returned (email confirmation may be required).");
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Log In</button>
      </form>
    </div>
  );
}
