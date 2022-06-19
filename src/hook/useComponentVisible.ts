import { useState, useEffect, useRef } from "react";

export default function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const refs = useRef<any>([]);

  const handleClickOutside = (event: Event) => {
    let visible = false;

    refs?.current.map((element: any) => {
      if (element.contains(event.target)) {
        visible = true;
      }
    });

    //not update when true, to have possibility to update from outside
    if (!visible) {
      setIsComponentVisible(visible);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { refs, isComponentVisible, setIsComponentVisible };
}
