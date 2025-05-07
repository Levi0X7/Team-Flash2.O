import { useState } from "react";
import { useLocation } from "wouter";
import GameContainer from "@/components/GameContainer";

export default function Game() {
  const [, setLocation] = useLocation();
  
  const goToMenu = () => {
    setLocation("/");
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <GameContainer goToMenu={goToMenu} />
    </div>
  );
}
