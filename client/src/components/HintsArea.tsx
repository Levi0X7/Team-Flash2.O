import React from "react";
import { Button } from "@/components/ui/button";

interface HintsAreaProps {
  onShowHint: () => void;
}

const HintsArea: React.FC<HintsAreaProps> = ({ onShowHint }) => {
  return (
    <div className="mt-8 text-center">
      <Button
        variant="link"
        className="text-primary text-sm flex items-center gap-1 mx-auto hover:underline"
        onClick={onShowHint}
      >
        <i className="ri-lightbulb-line"></i> 
        Get a hint <span className="text-xs text-gray-500">(costs 10 points)</span>
      </Button>
    </div>
  );
};

export default HintsArea;
