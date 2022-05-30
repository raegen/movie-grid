import { useEffect, useRef } from "react";

type Timeout = ReturnType<typeof setTimeout>;

export const useDebounceCall = <Arg>(
  callee: (...args: Arg[]) => void,
  debounceTime: number = 500
) => {
  const timeoutRef = useRef<Timeout>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (...args: Arg[]) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callee(...args), debounceTime);
  };
};
