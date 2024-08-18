"use client";
import Login from "@/app/components/auth/Login";
import Register from "@/app/components/auth/Register";
import ResetPassword from "@/app/components/auth/ResetPassword";
import UpdatePassword from "@/app/components/auth/UpdatePassword";
import Verification from "@/app/components/auth/Verification";
import { useState } from "react";

export default function Authentication() {
  const [active, setActive] = useState("login");
  return (
    <div className="w-full h-full min-h-screen bg-white dark:bg-gray-950">
      {active === "register" ? (
        <Register setActive={setActive} />
      ) : active === "login" ? (
        <Login setActive={setActive} />
      ) : active === "verification" ? (
        <Verification setActive={setActive} />
      ) : active === "resetPassword" ? (
        <ResetPassword setActive={setActive} />
      ) : (
        <UpdatePassword setActive={setActive} />
      )}
    </div>
  );
}
