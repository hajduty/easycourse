import { useState, useEffect } from "react";

export type StarRatingProps = {
  value?: number; // 0..5
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  id?: string;
  className?: string;
  initialValue?: number;
};

import { Star } from "lucide-react";

export function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  showLabel = false,
  id,
  className = "",
  initialValue,
}: StarRatingProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [internalValue, setInternalValue] = useState<number>(Math.max(0, Math.min(5, Math.round(value))));

  useEffect(() => {
    setInternalValue(Math.max(0, Math.min(5, Math.round(value))));
  }, [value]);

  const handleSelect = (index: number) => {
    if (readOnly) return;
    setInternalValue(index);
    onChange?.(index);
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-4 h-4",
    lg: "w-8 h-8",
  };

  return (
    <div className={`inline-flex items-center gap-3 z-10 text-xs ${className}`} id={id}>
      <div
        role={readOnly ? undefined : "radiogroup"}
        aria-label={readOnly ? `Rating: ${internalValue} of 5` : "Star rating"}
        tabIndex={readOnly ? -1 : 0}
        className="inline-flex items-center"
      >
        {[1, 2, 3, 4, 5].map((i) => {
          let filled = hoverIndex !== null ? i <= hoverIndex : i <= internalValue;
          let dimmed = false;

          if (!filled && initialValue !== undefined) {
            dimmed = i <= initialValue;
          }

          return (
            <button
              key={i}
              type="button"
              aria-checked={internalValue === i}
              aria-label={`${i} star${i > 1 ? "s" : ""}`}
              role="radio"
              disabled={readOnly}
              onMouseEnter={() => !readOnly && setHoverIndex(i)}
              onMouseLeave={() => !readOnly && setHoverIndex(null)}
              onFocus={() => !readOnly && setHoverIndex(i)}
              onBlur={() => !readOnly && setHoverIndex(null)}
              onClick={() => handleSelect(i)}
              className={`p-0.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors items-center flex ${
                readOnly ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="sr-only">{i === 1 ? `${i} star` : `${i} stars`}</span>
              <Star
                className={`${sizeClasses[size]} ${
                  filled
                    ? "text-yellow-400 fill-yellow-400"
                    : dimmed
                    ? "text-yellow-200 fill-yellow-400 opacity-50"
                    : "text-gray-400"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <div className="text-xs select-none">
          {internalValue === 0 ? "No rating" : `${internalValue} / 5`}
        </div>
      )}
    </div>
  );
}
