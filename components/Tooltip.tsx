"use client";

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
} from "react";

type TooltipChildProps = {
  "aria-describedby"?: string;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
};

type TooltipProps = {
  label: string;
  children: ReactElement<TooltipChildProps>;
  className?: string;
};

const SHOW_DELAY_MS = 100;

export default function Tooltip({ label, children, className = "" }: TooltipProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const show = () => {
    clearTimer();
    timerRef.current = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
  };

  const hide = () => {
    clearTimer();
    setVisible(false);
  };

  const child = cloneElement(children, {
    "aria-describedby": visible ? tooltipId : children.props["aria-describedby"],
  });

  return (
    <span
      className={`inline-flex ${className}`}
      onMouseEnter={(e) => {
        children.props.onMouseEnter?.(e);
        show();
      }}
      onMouseLeave={(e) => {
        children.props.onMouseLeave?.(e);
        hide();
      }}
      onFocus={(e) => {
        children.props.onFocus?.(e);
        show();
      }}
      onBlur={(e) => {
        children.props.onBlur?.(e);
        hide();
      }}
    >
      <span className="relative inline-flex w-full h-full">
        {child}
        {visible && (
          <span
            id={tooltipId}
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-white text-xs whitespace-nowrap pointer-events-none z-50"
          >
            {label}
          </span>
        )}
      </span>
    </span>
  );
}
