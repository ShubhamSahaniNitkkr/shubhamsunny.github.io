import { useEffect, useState } from 'react';

const ITEMS = ['Website Modernization', 'Data Scraping', 'Custom Software'];

export default function PortraitExpertiseRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let swapTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      swapTimeout = setTimeout(() => {
        setIndex((i) => (i + 1) % ITEMS.length);
        setVisible(true);
      }, 160);
    }, 1100);
    return () => {
      clearInterval(interval);
      clearTimeout(swapTimeout);
    };
  }, []);

  return (
    <div className="portrait-expertise-slot mt-4 flex justify-center">
      <span
        key={visible ? `${index}-in` : `${index}-out`}
        className={`expertise-pill portrait-expertise-pill ${visible ? 'portrait-expertise-in' : 'portrait-expertise-out'}`}
        aria-live="polite"
      >
        {ITEMS[index]}
      </span>
    </div>
  );
}
