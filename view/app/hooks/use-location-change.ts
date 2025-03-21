import { useEffect, useInsertionEffect, useRef } from "react";
import type { Location } from "react-router";
import { useLocation } from "react-router";

export type LocationChangeCallback = (location: Location) => void;

export const useLocationChange = (callback: LocationChangeCallback) => {
  // biome-ignore lint/suspicious/noEmptyBlockStatements:
  const ref = useRef<LocationChangeCallback>((_) => {});
  const location = useLocation();

  useInsertionEffect(() => {
    ref.current = callback;
  }, [callback]);

  useEffect(() => {
    if (ref.current) {
      ref.current(location);
    }
  }, [location]);
}
