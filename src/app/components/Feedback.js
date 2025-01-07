import React, { useEffect, useState } from "react";

export default function Feedback({ feedback }) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (feedback) {
      setIsShaking(true);

      // Remove the shake class after the animation completes (0.5s duration)
      const timer = setTimeout(() => setIsShaking(false), 500);

      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className={`feedback ${isShaking ? "shake" : ""}`}>
      <p>{feedback}</p>
    </div>
  );
}
