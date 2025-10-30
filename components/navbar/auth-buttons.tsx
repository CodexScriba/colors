"use client";

import * as React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  className?: string;
  variant?: "default" | "mobile";
}

export function AuthButtons({ className, variant = "default" }: AuthButtonsProps) {
  const handleLogin = () => {
    console.log("Login clicked");
    // TODO: Implement login functionality with Supabase
  };

  const handleSignUp = () => {
    console.log("Sign up clicked");
    // TODO: Implement sign up functionality with Supabase
  };

  const isMobile = variant === "mobile";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size={isMobile ? "default" : "sm"}
        onClick={handleLogin}
        className={cn(isMobile && "w-full justify-start")}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
      <Button
        size={isMobile ? "default" : "sm"}
        onClick={handleSignUp}
        className={cn(isMobile && "w-full justify-start")}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Sign Up
      </Button>
    </div>
  );
}
