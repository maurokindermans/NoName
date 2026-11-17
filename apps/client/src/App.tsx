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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

function App() {
  const BASE_URL = "http://localhost:8080";
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().setHours(0, 0, 0, 0)),
  );
  const [page, setPage] = useState("");
  const [types, setTypes] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(null);
  const [timeslots, setTimeSlots] = useState<any[]>([]);
  const [cancel, SetCancel] = useState(true);
  const [clientTimeslots, setClientTimeslots] = useState<any[]>([]);

  useEffect(() => {
    const loop = setInterval(() => {
      if (user !== null) {
        if (user.role === "PROFESSIONAL") {
          fetch(`${BASE_URL}/types`)
            .then((response) => response.json())
            .then((data) => {
              setTypes(data);
            });
        }
        if (user.role === "CLIENT") {
          fetch(`${BASE_URL}/timeslots/${user.id}`)
            .then((response) => response.json())
            .then((data) => {
              setClientTimeslots(data);
            });
        }
      }
    }, 1000);

    return () => {
      clearInterval(loop);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !date) {
      setTimeSlots([]);
      return;
    }

    fetch(`${BASE_URL}/timeslots/${user.role}/${date.toISOString()}`)
      .then((response) => response.json())
      .then((data) => {
        setTimeSlots(data);
      });
  }, [date, user, cancel]);

  if (page === "timeslots") {
    return (
      <>
        <div>My timeslots</div>
        <ScrollArea className="w-100 h-60 rounded-md border">
          {clientTimeslots.map((current) => {
            const start = new Date(current.startTime);
            const end = new Date(current.endTime);
            const options = {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            };
            return (
              <Card key={current.id}>
                <CardContent>
                  <div>{current.type}</div>
                  <div>Day: {start.toLocaleDateString("en-GB")}</div>
                  <div>Start: {start.toLocaleTimeString()}</div>
                  <div>End: {end.toLocaleTimeString()} </div>
                  <div>price : {current.endPrice} €</div>
                  {current.cancelTime && (
                    <div>
                      You are able to cancel until ${current.cancelTime} hours
                      before
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      handleCancelTimeSlot(current.id);
                    }}
                  >
                    cancel
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <Button onClick={() => setPage("")}>Go back</Button>
      </>
    );
  }

  if (page === "newTimeSlot") {
    return (
      <>
        <div>{date?.toLocaleDateString("en-GB")}</div>
        <form onSubmit={handleNewTimeSlot} className="">
          <FieldGroup className=" max-w-sm grid-cols-2 ">
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select required items={types} name="type">
                <SelectTrigger className="w-[180px] ">
                  <SelectValue placeholder="type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {types.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Start time</FieldLabel>
              <Input
                type="time"
                name="startTime"

                required
              />
            </Field>
            <div>
              <Button type="submit" className="border border-black">
                Create
              </Button>
              <Button
                onClick={() => {
                  setPage("");
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
                  <Button
                    onClick={() => {
                      handleDeleteType(current.id);
                    }}
                  >
                    delete
                  </Button>
                  <Button
                    onClick={() => {
                      setEdit(current);
                      setPage("manageType");
                    }}
                  >
                    edit
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <Button onClick={() => setPage("")}>Go back</Button>
        <Button onClick={() => setPage("manageType")}>Create type</Button>
      </>
    );
  }

  if (page === "manageType") {
    return (
      <>
        {!edit && <div>New Type</div>}
        {edit && <div>Edit Type</div>}
        <form onSubmit={handleManageType} className="">
          <FieldGroup className=" max-w-sm grid-cols-2 ">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                type="text"
                defaultValue={edit?.name}
                name="name"
                required
              />
            </Field>
            <Field>
              <FieldLabel>price in euros</FieldLabel>
              <Input
                type="number"
                defaultValue={edit?.amountInEuros}
                name="money"
                step=".01"
                min="0"
                required
              />
            </Field>
            <Field>
              <FieldLabel>duration in minutes</FieldLabel>
              <Input
                type="number"
                defaultValue={edit?.durationMinutes}
                name="minutes"
                step=""
                min="0"
                required
              />
            </Field>
            <div>
              {!edit && (
                <Button type="submit" className="border border-black">
                  Create
                </Button>
              )}
              {edit && (
                <Button type="submit" className="border border-black">
                  Edit
                </Button>
              )}
              <Button
                onClick={() => {
                  setPage("My types");
                  setEdit("null");
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
        <div className="flex justify-around ">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border"
            />
            {user.role === "PROFESSIONAL" && (
              <Button onClick={() => setPage("My types")}>My types</Button>
            )}
            {user.role !== "PROFESSIONAL" && (
              <Button onClick={() => setPage("timeslots")}>My timeslots</Button>
            )}
          </div>
          <div>
            <ScrollArea className="w-100 h-120 rounded-md border">
              {!date && (
                <div className=" text-center">
                  Select a date to see time slots
                </div>
              )}
              {date && <div className="text-center font-bold">Time slots</div>}
              {timeslots.map((current) => {
                const start = new Date(current.startTime);
                const end = new Date(current.endTime);

                return (
                  <Card key={current.id}>
                    <CardContent>
                      <div>{current.type}</div>
                      <div>Start: {start.toLocaleTimeString()}</div>
                      <div>End: {end.toLocaleTimeString()} </div>
                      <div>price : {current.endPrice} €</div>
                      {current.cancelTime && (
                        <div>
                          You are able to cancel until ${current.cancelTime}{" "}
                          hours before
                        </div>
                      )}
                      {user.role === "PROFESSIONAL" && (
                        <div>
                          client:{" "}
                          {current.client?.email ||
                            "No client has booked this time slot "}
                        </div>
                      )}
                      {user.role === "PROFESSIONAL" && (
                        <Button
                          onClick={() => {
                            handleDeleteTimeSlot(current.id);
                          }}
                        >
                          cancel
                        </Button>
                      )}
                      {user.role === "CLIENT" && (
                        <Button onClick={() => handleBooking(current.id)}>
                          book
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              <ScrollBar orientation="vertical" />
            </ScrollArea>
            {user.role === "PROFESSIONAL" && (
              <Button
                onClick={() => {
                  setPage("newTimeSlot");
                }}
                className=""
              >
                +
              </Button>
            )}
          </div>
        </div>
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

  function handleManageType(event: React.SubmitEvent) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    let amountInEuros = formData.get("money");

    if (typeof amountInEuros === "string") {
      amountInEuros = parseFloat(amountInEuros).toFixed(2);
    }

    const name = formData.get("name");
    const durationMinutes = formData.get("minutes");

    if (edit) {
      fetch(`${BASE_URL}/types`, {
        method: "PUT",
        body: JSON.stringify({
          id: edit.id,
          amountInEuros,
          name,
          durationMinutes,
        }),
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
            setEdit(null);
            toast.success("Type has been edited", { position: "top-center" });
          }
        });
      return;
    }

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

  function handleDeleteType(id: number) {
    fetch(`${BASE_URL}/types`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          toast.success(data.message, { position: "top-center" });
        }
      });
  }

  function handleNewTimeSlot(event: React.SubmitEvent) {
    event.preventDefault();

    if (!date) {
      toast.error("Date selected is invalid", { position: "top-center" });
      return;
    }

    const form = event.target;
    const formData = new FormData(form);
    const type = formData.get("type");
    let startHours: any = formData.get("startTime");

    startHours = startHours.split(":").map((current: string) => {
      return parseInt(current);
    });

    let startTime = new Date(date);
    startTime.setHours(startHours[0], startHours[1]);

    fetch(`${BASE_URL}/timeslots`, {
      method: "POST",
      body: JSON.stringify({ type, startTime }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          setPage("");
          SetCancel(!cancel);
          toast.success("Timeslot has been created", {
            position: "top-center",
          });
        }
      });
  }

  function handleDeleteTimeSlot(id: number) {
    fetch(`${BASE_URL}/timeslots`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          SetCancel(!cancel);
          toast.success(data.message, { position: "top-center" });
        }
      });
  }

  function handleBooking(id: number) {
    const clientId = user.id;
    fetch(`${BASE_URL}/timeslots`, {
      method: "PUT",
      body: JSON.stringify({ id, clientId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          SetCancel(!cancel);
          toast.success(data.message, { position: "top-center" });
        }
      });
  }

  function handleCancelTimeSlot(id: number) {
    fetch(`${BASE_URL}/timeslots/cancel`, {
      method: "PUT",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          SetCancel(!cancel);
          toast.success(data.message, { position: "top-center" });
        }
      });
  }
}

export default App;
