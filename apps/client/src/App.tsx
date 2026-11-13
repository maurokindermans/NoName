import React, { useState } from "react";
import "./App.css";
import { Calendar } from "@/components/ui/calendar";

function App() {
  const BASE_URL = "http://localhost:8080";
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  if (user) {
    return (
      <>
        <div>{`${user.email} ${user.role === "PROFESSIONAL" ? user.role : ""}`}</div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
      </>
    );
  }

  return (
    <form onSubmit={handleLogin} className="">
      <div>email</div>
      <input
        type="email"
        className="border border-black"
        name="email"
        required
      />
      <div>password</div>
      <input type="text" className="border border-black" />
      <input
        type="submit"
        value="Log in"
        className="border border-black"
        required
      />
    </form>
  );

  function handleLogin(event: React.SubmitEvent) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get("email");

    fetch(`${BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      });
  }
}

export default App;
