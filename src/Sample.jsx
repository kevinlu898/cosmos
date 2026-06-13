import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase, create, update, list } from "./lib/database.js";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [claims, setClaims] = useState(null);

  // Click counter states
  const [clicks, setClicks] = useState(0);
  const [countRow, setCountRow] = useState(null);

  // Load user's count once they're logged in.
  useEffect(() => {
    if (!claims) return;
    list("counts", { limit: 1 }).then((rows) => {
      if (rows && rows.length > 0) {
        setCountRow(rows[0]);
        setClicks(rows[0].clickTimes ?? 0);
      } else {
        setCountRow(null);
        setClicks(0);
      }
    });
  }, [claims]);

  // Increment the click count and savve to "counts" table in DB
  async function click() {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    if (countRow) {
      const updated = await update("counts", countRow.id, {
        clickTimes: newClicks,
      });
      setCountRow(updated);
    } else {
      const created = await create("counts", {
        clickTimes: newClicks,
        user_id: claims.sub,
      });
      setCountRow(created);
    }
  }

  async function signUpNewUser(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "http://localhost:5173",
      },
    });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      setClaims({ email: data.email });
    }
    return { data, error };
  }

  async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      console.log({ data, error });
      setClaims({ email: data.email });
    }
    return { data, error };
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setClaims(null);
  };

  useEffect(() => {
    // Check for existing session using getClaims
    supabase.auth.getClaims().then(({ data }) => {
      setClaims(data?.claims);
    });
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then(({ data: { claims } }) => {
        setClaims(claims);
      });
    });
    return () => subscription.unsubscribe();
  }, []);
  if (!claims) {
    return (
      <div>
        <h1> welcome to the app :evil_grin:</h1>
        <div>you are not logged in.</div> <br></br>
        <div>Email:</div>
        <br></br>
        <Input
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-50"
        />
        <br></br>
        <div>Password:</div>
        <br></br>
        <Input
          placeholder="enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-50"
        />
        <br></br>
        <Button onClick={() => signUpNewUser(email, password)}>Sign Up</Button>
        <Button onClick={() => signInWithEmail(email, password)}>
          Sign In
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Welcome {claims.email}</h1>
        <Button onClick={() => click()}>Click me</Button>
        <p>Clicks: {clicks}</p>
        <Button onClick={() => handleLogout()}>logout</Button>
      </div>
    );
  }
}

export default App;
