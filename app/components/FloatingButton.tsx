"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import ChatBot from "@/app/components/ChatBot";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import useSound from "use-sound";

interface FloatingButtonProps {
  terminalWidth: number;
  initialMessageComplete?: boolean;
}

export default function FloatingButton({
  terminalWidth,
  initialMessageComplete = false,
}: FloatingButtonProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.4);
  const [isLoading, setIsLoading] = useState(true);
  const fadeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAutoplayedRef = useRef(false);

  const [play, { pause }] = useSound("/music/background-music.mp3", {
    volume,
    loop: true,
    interrupt: false,
    onload: () => {
      setIsLoading(false);
      console.log("Music loaded successfully");
    },
  });

  const handleInitialPlay = useCallback(() => {
    try {
      hasAutoplayedRef.current = true;
      setIsMuted(false);
      play();
      toast("🔊 Music played", {
        description: "Background music is now playing",
      });
    } catch (error) {
      console.error("Autoplay failed:", error);
      toast("⚠️ Error", {
        description: "Could not autoplay the music",
      });
    }
  }, [play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeInterval.current) {
        clearInterval(fadeInterval.current);
      }
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
      pause();
    };
  }, [pause]);

  useEffect(() => {
    if (!initialMessageComplete || isLoading || hasAutoplayedRef.current) {
      return;
    }

    autoplayTimeoutRef.current = setTimeout(() => {
      handleInitialPlay();
    }, 2000);

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [handleInitialPlay, initialMessageComplete, isLoading]);

  const fadeIn = () => {
    if (fadeInterval.current) clearInterval(fadeInterval.current);
    let vol = 0;
    setVolume(vol);
    fadeInterval.current = setInterval(() => {
      if (vol < 0.4) {
        // Fade in to 40%
        vol += 0.05;
        setVolume(vol);
      } else {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
      }
    }, 100);
  };

  const fadeOut = () => {
    if (fadeInterval.current) clearInterval(fadeInterval.current);
    let vol = 0.4; // Start fade out from 40%
    setVolume(vol);
    fadeInterval.current = setInterval(() => {
      if (vol > 0) {
        vol -= 0.05;
        setVolume(vol);
      } else {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
        pause();
      }
    }, 100);
  };

  const handlePlay = () => {
    setIsMuted(false);
    fadeIn();
    play();
    toast("🔊 Music played", {
      description: "Background music is now playing",
    });
  };

  const handleStop = () => {
    setIsMuted(true);
    fadeOut();
    toast("🔇 Music muted", {
      description: "Background music has been muted",
    });
  };

  const toggleMute = () => {
    try {
      if (isMuted) {
        handlePlay();
      } else {
        handleStop();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      toast("⚠️ Error", {
        description: "Could not play the audio file",
      });
    }
  };

  return (
    <>
      {/* Left Floating Button (Music Toggle) */}
      <div
        className="fixed bottom-4 left-4 z-50"
        style={{
          width: `${terminalWidth}px`,
          maxWidth: "95vw",
        }}
      >
        <Button
          onClick={toggleMute}
          disabled={isLoading}
          className={`rounded-full p-2 bg-[#131821]/50 backdrop-blur-lg border-[2px] border-[#273344]/50 text-slate-200 transition-all duration-300 hover:border-[#273344] ${
            isMuted ? "text-[#F43F5E] border-[#F43F5E]/50" : ""
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          variant="outline"
        >
          {isLoading ? (
            <div className="h-6 w-6 animate-pulse">⏳</div>
          ) : isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
          <span className="sr-only">
            {isLoading ? "Loading music" : "Toggle Sound"}
          </span>
        </Button>
      </div>

      {/* Right Floating Buttons (Chat and Back to Top) */}
      <div
        className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50"
        style={{
          width: `${terminalWidth}px`,
          maxWidth: "95vw",
        }}
      >
        <BackToTheTop />
        <ChatBot />
      </div>
    </>
  );
}

function BackToTheTop() {
  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="rounded-full p-2 bg-[#131821]/50 backdrop-blur-lg border-[2px] border-[#273344]/50 text-slate-200 hover:border-[#273344]"
      variant="outline"
    >
      <ArrowUp className="h-6 w-6" />
      <span className="sr-only">Back to top</span>
    </Button>
  );
}
