import React, { useEffect, useState } from "react";
import "./App.css";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "./components/ui/field";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

    return () => {
      clearInterval(loop);
    };
  }, []);

  if (page === "My types") {
    return (
      <>
        <div>My types</div>
        <ScrollArea className="w-100 h-60 rounded-md border">
          {types.map((current) => {
            return (
              <Card key={current.name}>
                <CardContent>
                  <div>Name: {current.name}</div>
                  <div>Duration: {current.durationMinutes} minutes</div>
                  <div>Price: {current.amountInEuros} €</div>
                  <Button>delete</Button>
                  <Button>edit</Button>
                </CardContent>
              </Card>
            );
          })}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <Button onClick={() => setPage("")}>Go back</Button>
        <Button onClick={() => setPage("New Type")}>Create type</Button>
      </>
    );
  }

  if (page === "New Type") {
    return (
      <>
        <div>New Type</div>
        <form onSubmit={handleNewType} className="">
          <FieldGroup className=" max-w-sm grid-cols-2 ">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input type="text" name="name" required />
            </Field>
            <Field>
              <FieldLabel>price in euros</FieldLabel>
              <Input type="number" name="money" step=".01" required />
            </Field>
            <Field>
              <FieldLabel>duration in minutes</FieldLabel>
              <Input type="number" name="minutes" step="" required />
            </Field>
            <div>
              <Button type="submit" className="border border-black">
                Create
              </Button>
              <Button
                onClick={() => {
                  setPage("My Types");
                }}
              >
                Go back
              </Button>
            </div>
          </FieldGroup>
        </form>
      </>
    );
  }

  if (user) {
    return (
      <>
        <div className="flex justify-between">
          <div>Company name and logo</div>
          <div>{`${user.email} `}</div>
          {user.role === "PROFESSIONAL" && <div>PROFESSIONAL</div>}
          <Button onClick={() => setUser(null)}>logout</Button>
        </div>
        <Separator />
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
    <>
      <div className="flex  h-screen justify-center">
        <div className="self-center w-[300px] ">
          <div className="">Company Name</div>
          <form onSubmit={handleLogin} className="">
            <FieldGroup className=" max-w-sm grid-cols-2 ">
              <Field>
                <FieldLabel>email</FieldLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>password</FieldLabel>
                <Input
                  type="password"
                  name="password"
                  placeholder="password"
                  required
                />
              </Field>
              <Button type="submit" className="border border-black">
                Log in
              </Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
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
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          setUser(data);
        }
      });
  }

  function handleNewType(event: React.SubmitEvent) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    let amountInEuros = formData.get("money");

    if (typeof amountInEuros === "string") {
      amountInEuros = parseFloat(amountInEuros).toFixed(2);
    }

    const name = formData.get("name");
    const durationMinutes = formData.get("minutes");

    fetch(`${BASE_URL}/types`, {
      method: "POST",
      body: JSON.stringify({ amountInEuros, name, durationMinutes }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          setPage("My types");
          toast.success("Type has been created", { position: "top-center" });
        }
      });
  }
}

export default App;
