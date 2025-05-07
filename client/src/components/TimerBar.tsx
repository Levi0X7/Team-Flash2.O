import React from "react";

interface TimerBarProps {
  percentage: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ percentage }) => {
  // Ensure percentage is within valid range
  const validPercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
      <div 
        className="timer-bar bg-primary h-full rounded-full" 
        style={{ width: `${validPercentage}%` }}
      ></div>
    </div>
  );
};

export default TimerBar;
