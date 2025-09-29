import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    // Sign up
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    // If signup returns session, upsert user row
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    if (token) {
      await fetch("http://127.0.0.1:8000/users/upsert", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    alert("Signup initiated. Check your email if confirmation is enabled.");
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
