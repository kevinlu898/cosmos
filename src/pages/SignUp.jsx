import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, create } from "../lib/database.js";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { AuthShell } from "../components/AuthShell.jsx";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") === "true") {
      navigate("/home");
    }
  }, [navigate]);

  async function handleSignUp() {
    const parsedAge = Number(age);
    if (Number.isNaN(parsedAge) || parsedAge < 0 || parsedAge > 100) {
      alert("Please enter a valid age between 0 and 100.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message || error.error_description);
        return;
      }
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name || email);
      try {
        if (data?.user?.id) {
          await create("profiles", { user_id: data.user.id, name: name, age: parsedAge, stardust: 0 });
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
    <AuthShell>
      <div className="rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <img src="/logo-full.png" alt="Cosmos" className="mx-auto mb-2 h-24 w-auto" />
        <h2 className="mb-6 text-center text-2xl font-semibold text-white">Join the adventure!</h2>

        <form
          className="space-y-4 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <div>
            <label className="mb-1.5 block pl-2 text-sm font-medium text-white/80">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1.5 block pl-2 text-sm font-medium text-white/80">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block pl-2 text-sm font-medium text-white/80">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="mb-1.5 block pl-2 text-sm font-medium text-white/80">Age</label>
            <Input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              min={0}
              max={100}
              placeholder="Age (0-100)"
            />
          </div>

          <Button type="submit" variant="sunset" size="lg" className="mt-2 w-full">Create account</Button>
        </form>

        <Button className="mt-4 w-full text-sm text-white/80 hover:bg-white/10" variant="ghost" onClick={() => navigate('/signin')}>
          Have an account? Sign in
        </Button>
      </div>
    </AuthShell>
  );
}