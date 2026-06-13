import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, create } from "../lib/database.js";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";

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
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Cosmos</h1>
      <h2 className="text-lg font-medium mb-4">Sign up</h2>
      <div className="mb-2 text-left">Name</div>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full mb-3" />
      <div className="mb-2 text-left">Email</div>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mb-3" />
      <div className="mb-2 text-left">Password</div>
      <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="w-full mb-4" />
      <div className="mb-2 text-left">Age</div>
      <Input
        value={age}
        onChange={(e) => setAge(e.target.value)}
        type="number"
        min={0}
        max={100}
        placeholder="Age (0-100)"
        className="w-full mb-4"
      />

        <Button className="w-full" onClick={handleSignUp}>Create account</Button>
        <Button className="text-sm mt-5" variant="ghost" onClick={() => navigate('/signin')}>Have an account? Sign in</Button>

    </div>
  );
}