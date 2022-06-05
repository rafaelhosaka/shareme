import { useState } from "react";

export function useToggle(
  defaultValue: boolean = false
): [boolean, () => void] {
  const [value, setValue] = useState(defaultValue);

  const toggleValue = () => {
    setValue((currentValue) => !currentValue);
  };

  return [value, toggleValue];
}
