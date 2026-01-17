import { useState } from 'react';

export const useRevealSequence = () => {
  const [isClarified, setIsClarified] = useState(false);

  const triggerClarity = () => {
    setIsClarified(true);
  };

  return {
    isClarified,
    triggerClarity,
  };
};