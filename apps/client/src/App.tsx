import React, { useEffect, useState } from "react";
import "./App.css";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
function App() {
  const BASE_URL = "http://localhost:8080";
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [page, setPage] = useState("");
  const [types, setTypes] = useState<any[]>([]);

  useEffect(() => {
    const loop = setInterval(() => {
      fetch(`${BASE_URL}/types`)
        .then((response) => response.json())
        .then((data) => {
          setTypes(data);
        });
    }, 1000);

    return clearInterval(loop);
  }, []);

  if (page === "My types") {
    return (
      <>
        <div>My types</div>
        <div>
          {types.map((current) => {
            return (
              <div>
                <div>{current.name}</div>
                <div>{current.durationMinutes}</div>
                <div>{current.amountInEuros}</div>
              </div>
            );
          })}
        </div>
        <Button onClick={() => setPage("")}>Go back</Button>
      </>
    );
  }

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
        {user.role === "PROFESSIONAL" && (
          <Button onClick={() => setPage("My types")}>My types</Button>
        )}
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
      <input type="text" className="border border-black" required />
      <input type="submit" value="Log in" className="border border-black" />
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
