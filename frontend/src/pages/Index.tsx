import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import backgroundImage from "@/assets/islamic-background.jpg";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Apply dark theme to document
    document.documentElement.classList.add("dark");
  }, []);

  const handleGetStarted = () => {
    sessionStorage.setItem("cameFromLanding", "true");
    navigate("/chat");
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Static overlay */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <Navbar />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-9xl font-black tracking-tight mb-8 animate-grow-in text-purple-400">
            FIQH AI
          </h1>
          <p className="text-lg font-normal max-w-2xl mx-auto mb-12 animate-fade-in-left text-purple-300">
            Guiding You Through the Islamic Jurisprudence with Ease.
          </p>
          <Button
            onClick={handleGetStarted}
            className="px-12 py-6 border-0 transition-all duration-300 font-medium rounded-2xl text-xl hover:scale-105 animate-fade-in-delayed shadow-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Get Started
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;