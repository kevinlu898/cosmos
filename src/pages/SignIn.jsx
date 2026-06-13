import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/database.js";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") === "true") {
      navigate("/home");
    }
  }, [navigate]);

  async function handleSignIn() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message || error.error_description);
        return;
      }
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      try {
        const { data: profile, error: pErr } = await supabase.from('profiles').select('name').eq('user_id', data.user.id).maybeSingle();
        if (!pErr && profile?.name) {
          localStorage.setItem('userName', profile.name);
        } else {
          localStorage.setItem('userName', email);
        }
      } catch (err) {
        console.warn('profile fetch failed', err);
        localStorage.setItem('userName', email);
      }
      navigate('/home');
    } catch (err) {
      alert(err.message || String(err));
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Cosmos</h1>
      <h2 className="text-lg font-medium mb-4">Sign in</h2>
      <div className="mb-2 text-left">Email</div>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mb-3" />
      <div className="mb-2 text-left">Password</div>
      <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="w-full mb-4" />

    <Button className="w-full" onClick={handleSignIn}>Sign in</Button>
    <Button className="text-sm mt-5" variant="ghost" onClick={() => navigate('/')}>New here? Create account</Button>
    </div>
  );
}