import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/database.js";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { AuthShell } from "../components/AuthShell.jsx";

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
    <AuthShell>
      <div className="rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <img src="/logo-full.png" alt="Cosmos" className="mx-auto mb-2 h-24 w-auto" />
        <h2 className="mb-6 text-center text-2xl font-semibold text-white">Welcome back!</h2>

        <form
          className="space-y-4 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <div>
            <label className="mb-1.5 block pl-2 text-sm font-medium text-white/80">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block pl-2 text-sm font-medium text-white/80">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </div>

          <Button type="submit" variant="cosmos" size="lg" className="mt-2 w-full">Sign in</Button>
        </form>

        <Button className="mt-4 w-full text-sm text-white/80 hover:bg-white/10" variant="ghost" onClick={() => navigate('/signup')}>
          New here? Create account
        </Button>
      </div>
    </AuthShell>
  );
}