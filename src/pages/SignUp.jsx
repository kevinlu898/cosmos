import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, create } from "../lib/database.js";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignUp() {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message || error.error_description);
        return;
      }
      try {
        if (data?.user?.id) {
          await create("profiles", { user_id: data.user.id, name: name, stardust: 0 });
        }
      } catch (err) {
        console.warn("profiles insert failed:", err.message || err);
      }
      navigate("/home");
    } catch (err) {
      alert(err.message || String(err));
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
      <div className="mb-2 text-left">Name</div>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full mb-3" />
      <div className="mb-2 text-left">Email</div>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mb-3" />
      <div className="mb-2 text-left">Password</div>
      <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="w-full mb-4" />

      <div className="flex gap-3">
        <Button onClick={handleSignUp}>Create account</Button>
        <Button variant="ghost" onClick={() => navigate('/signin')}>Have an account? Sign in</Button>
      </div>
    </div>
  );
}
