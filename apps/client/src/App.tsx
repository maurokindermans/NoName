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
import logo from "./assets/logo.png";

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
  const [cancelTimeInHours, setCancelTimeInHours] = useState("");

  useEffect(() => {
    const loop = setInterval(() => {
      if (user !== null) {
        if (user.role === "PROFESSIONAL") {
          fetch(`${BASE_URL}/types`)
            .then((response) => response.json())
            .then((data) => {
              setTypes(data);
            });

          fetch(`${BASE_URL}/canceltime`)
            .then((response) => response.json())
            .then((data) => {
              setCancelTimeInHours(data.amountInHours);
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
    }, 1100);

    return () => {
      clearInterval(loop);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !date) {
      setTimeSlots([]);
      return;
    }

    fetch(`${BASE_URL}/timeslots/${user.id}/${date.toISOString()}`)
      .then((response) => response.json())
      .then((data) => {
        setTimeSlots(data);
      });
  }, [date, user, cancel]);

  if (page === "timeslots") {
    const now = new Date();

    return (
      <>
        <div className="flex w-[1100px] m-auto justify-center pt-10">
          <div>
            <div className="text-center font-bold my-4">My time slots</div>
            <ScrollArea className="w-140 h-120 rounded-md border mb-2">
              {clientTimeslots.map((current) => {
                const start = new Date(current.startTime);
                const end = new Date(current.endTime);
                const cancelTime = new Date(current.cancelTime);
                const cancelAllow = now < cancelTime;

                return (
                  <Card className="bg-gray-100 mx-8 my-4" key={current.id}>
                    <CardContent>
                      <div>{current.type}</div>
                      <div>Day: {start.toLocaleDateString("en-GB")}</div>
                      <div>Start: {start.toLocaleTimeString()}</div>
                      <div>End: {end.toLocaleTimeString()} </div>
                      <div>price : {current.endPrice} €</div>
                      {current.cancelTime &&
                        (cancelAllow === true ? (
                          <div>
                            You are able to cancel until{" "}
                            {cancelTime.toLocaleString("en-GB")}
                          </div>
                        ) : (
                          <div>You are unable to cancel</div>
                        ))}

                      <Button
                        className="my-2"
                        disabled={!cancelAllow}
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
          </div>
        </div>
      </>
    );
  }

  if (page === "newTimeSlot") {
    return (
      <>
        <div className="w-[1100px] m-auto pt-10 flex justify-center ">
          <div className="w-[558px]">
            <div className="text-center font-bold my-4">
              {date?.toLocaleDateString("en-GB")}
            </div>
            <form onSubmit={handleNewTimeSlot} className="">
              <FieldGroup className=" max-w-sm grid-cols-2 ">
                <Card className="w-[558px] px-5 pt-4 ">
                  <CardContent className="flex flex-col gap-4">
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
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button type="submit">Create</Button>
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
          </div>
        </div>
      </>
    );
  }

  if (page === "My types") {
    return (
      <div className="flex w-[1100px] m-auto justify-center pt-10">
        <div>
          <div className="text-center font-bold my-4">My types</div>
          <ScrollArea className="w-140 h-120 rounded-md border mb-2">
            {types.map((current) => {
              return (
                <Card className="bg-gray-100 mx-8 my-4" key={current.name}>
                  <CardContent>
                    <div>Name: {current.name}</div>
                    <div>Duration: {current.durationMinutes} minutes</div>
                    <div>Price: {current.amountInEuros} €</div>
                    <div className="flex gap-2 mt-2">
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
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <div className="flex gap-2">
            <Button onClick={() => setPage("")}>Go back</Button>
            <Button onClick={() => setPage("manageType")}>Create type</Button>
          </div>
        </div>
      </div>
    );
  }

  if (page === "manageType") {
    return (
      <>
        <div className="w-[1100px] m-auto pt-10 flex justify-center ">
          <div className="w-[558px]">
            {!edit && (
              <div className="text-center font-bold my-4">New Type</div>
            )}
            {edit && (
              <div className="text-center font-bold my-4">Edit Type</div>
            )}

            <form onSubmit={handleManageType} className="">
              <FieldGroup className=" max-w-sm grid-cols-2 ">
                <Card className="w-[558px] px-5 pt-4 ">
                  <CardContent className="flex flex-col gap-4">
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
                      <FieldLabel>Price in euros</FieldLabel>
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
                      <FieldLabel>Duration in minutes</FieldLabel>
                      <Input
                        type="number"
                        defaultValue={edit?.durationMinutes}
                        name="minutes"
                        step=""
                        min="0"
                        required
                      />
                    </Field>
                  </CardContent>
                </Card>
                <div>
                  <div className="flex gap-2">
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
                        setEdit(null);
                      }}
                    >
                      Go back
                    </Button>
                  </div>
                </div>
              </FieldGroup>
            </form>
          </div>
        </div>
      </>
    );
  }

  if (user) {
    return (
      <>
        <div className="flex justify-between items-center w-[1100px] m-auto">
          <img src={logo} alt="Yatseefa projects logo" className="h-20" />
          <div>{`${user.email} `}</div>
          <Button onClick={() => setUser(null)}>Logout</Button>
        </div>
        <Separator />
        <div className="flex justify-between w-[1100px] m-auto pt-4  ">
          <div>
            <div className="text-center font-bold my-4">Calendar</div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border [--cell-size:4rem]"
            />
          </div>
          <div>
            <div className="text-center font-bold my-4">Time slots</div>
            <ScrollArea className="w-140 h-120 rounded-md border ">
              {!date && (
                <div className=" text-center">
                  Select a date to see time slots
                </div>
              )}

              {timeslots.map((current) => {
                const start = new Date(current.startTime);
                const end = new Date(current.endTime);
                const cancelTime = new Date(current.cancelTime);
                const now = new Date();
                const cancelAllow = !current.cancelTime || now < cancelTime;
                const bookAllow = now < start;

                return (
                  <Card className="bg-gray-100 mx-8 my-4" key={current.id}>
                    <CardContent>
                      <div>{current.type}</div>
                      <div>Start: {start.toLocaleTimeString()}</div>
                      <div>End: {end.toLocaleTimeString()} </div>
                      <div>Price : {current.endPrice} €</div>

                      {current.cancelTime && (
                        <div>
                          The event is cancelable until{" "}
                          {cancelTime.toLocaleString("en-GB")}
                        </div>
                      )}
                      {user.role === "PROFESSIONAL" && (
                        <>
                          <div>
                            client:{" "}
                            {current.client?.email ||
                              "No client has booked this time slot "}
                          </div>
                          <Button
                            className="my-2"
                            onClick={() => {
                              handleDeleteTimeSlot(current.id);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                      {user.role === "CLIENT" &&
                        current.status === "available" && (
                          <Button
                            disabled={!bookAllow}
                            className="my-2"
                            onClick={() => handleBooking(current.id)}
                          >
                            Book
                          </Button>
                        )}
                      {user.role === "CLIENT" && current.status === "taken" && (
                        <>
                          <Button className="my-2" disabled>
                            Book
                          </Button>
                          <p className="text-red-600 ">No seats available</p>
                        </>
                      )}
                      {user.role === "CLIENT" &&
                        current.status === "claimed" && (
                          <>
                            <div className="flex gap-2 my-2">
                              <Button disabled>Book</Button>
                              <Button
                                disabled={!cancelAllow}
                                onClick={() => {
                                  handleCancelTimeSlot(current.id);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                            <p className="text-green-600 ">Already booked</p>
                          </>
                        )}
                    </CardContent>
                  </Card>
                );
              })}

              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </div>
        <div className="w-[1100px] m-auto">
          <div className=" font-bold my-4">Actions</div>
          <Card>
            <CardContent className="flex justify-between items-center">
              {user.role !== "PROFESSIONAL" && (
                <Button onClick={() => setPage("timeslots")}>
                  My timeslots
                </Button>
              )}
              {user.role === "PROFESSIONAL" && (
                <>
                  <div className="flex flex-col gap-2 ">
                    <Button onClick={() => setPage("My types")}>
                      My timeslot types
                    </Button>
                    <Button
                      onClick={() => {
                        setPage("newTimeSlot");
                      }}
                      className=""
                    >
                      Add a timeslot
                    </Button>
                  </div>
                  <div>
                    <Card className="w-100">
                      <CardContent>
                        <form onSubmit={handleCancelTime}>
                          <FieldGroup className=" max-w-sm grid-cols-2 ">
                            <Field>
                              <FieldLabel>Cancel time in hours:</FieldLabel>
                              <Input
                                type="number"
                                name="cancelHours"
                                placeholder="Enter amount"
                                defaultValue={cancelTimeInHours}
                                step=""
                              />
                            </Field>
                            <Button
                              type="submit"
                              className="border border-black"
                            >
                              Set
                            </Button>
                          </FieldGroup>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex  h-screen justify-center">
        <div className="py-[16px] w-[300px] ">
          <img src={logo} alt="Yatseefa projects logo" className="m-auto" />
          <form onSubmit={handleLogin} className="">
            <FieldGroup className=" max-w-sm grid-cols-2 ">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
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

  function handleCancelTime(event: React.SubmitEvent) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const amountInHours = formData.get("cancelHours");

    fetch(`${BASE_URL}/canceltime`, {
      method: "PUT",
      body: JSON.stringify({ amountInHours }),
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
}

export default App;
