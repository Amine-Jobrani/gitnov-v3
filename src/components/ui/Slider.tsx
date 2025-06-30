import React, { useState, useRef } from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    setIsDragging(true);
    
    // Capture the track's bounding rectangle once
    const trackRect = trackRef.current?.getBoundingClientRect();
    if (!trackRect) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const percentage = Math.max(0, Math.min(1, (e.clientX - trackRect.left) / trackRect.width));
      const newValue = Math.round((min + percentage * (max - min)) / step) * step;
      
      const newValues = [...value];
      newValues[index] = newValue;
      
      if (newValues.length === 2) {
        newValues.sort((a, b) => a - b);
      }
      
      onValueChange(newValues);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getThumbPosition = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };


  // -------------------------------------------------------
  // src/components/ui/Slider.tsx   (remplace intégralement le return)
  // -------------------------------------------------------
  return (
    <div className={cn('relative w-full', className)}>
      <div ref={trackRef} className="relative h-2 bg-gray-200 rounded-full">

        {/* --- Piste active --- */}
        {value.length === 2 ? (
          /* Slider « range » (deux curseurs) */
          <div
            className="absolute h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            style={{
              left: `${getThumbPosition(value[0])}%`,
              width: `${getThumbPosition(value[1]) - getThumbPosition(value[0])}%`,
            }}
          />
        ) : (
          /* Slider « simple » (un seul curseur) */
          <div
            className="absolute h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            style={{
              width: `${getThumbPosition(value[0])}%`,
            }}
          />
        )}

        {/* --- Curseurs --- */}
        {value.map((val, index) => (
          <div
            key={index}
            className="absolute w-5 h-5 bg-white border-2 border-orange-500 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow transform -translate-y-1.5"
            style={{ left: `${getThumbPosition(val)}%`, marginLeft: '-10px' }}
            onMouseDown={handleMouseDown(index)}
          />
        ))}
      </div>
    </div>
  );

  
};