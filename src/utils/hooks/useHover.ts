import { RefObject, useCallback, useState } from "react";
import useEventListener from "./useEventListener";


function useHover<T extends HTMLElement = HTMLElement>(
    elementRef: RefObject<T>,
): boolean {
    const [value, setValue] = useState<boolean>(false);

    const handleMouseEnter = useCallback(() => setValue(true), [setValue]);
    const handleMouseLeave = useCallback(() => setValue(false), [setValue]);

    useEventListener("mouseenter", handleMouseEnter, elementRef);
    useEventListener("mouseleave", handleMouseLeave, elementRef);

    return value;
}

export default useHover;
