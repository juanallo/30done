import { useEffect, useState } from "react";

export const Motivation = () => {
  const [currentMotivation, setCurrentMotivation] = useState(0);

  const motivations = [
    "Set Your Goal, Crush Your Limit!",
    "Every Rep & Day Counts!",
    "Stronger Every Day!",
    "Your Future Self Thanks You!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMotivation((prev) => (prev + 1) % motivations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl font-bold mb-4">
      {motivations[currentMotivation]}
    </h1>
  );
};
