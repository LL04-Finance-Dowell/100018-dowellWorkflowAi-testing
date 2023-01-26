import { useEffect } from "react";

export default function useCloseElementOnEscapekeyClick (handleClick) {
    useEffect(() => {

        const handleCloseElementOnEscapeKey = (e) => {
            if (!handleClick || typeof handleClick !== "function") return
            if (e.key === "Escape") handleClick();
        }
    
        document.addEventListener("keydown", handleCloseElementOnEscapeKey, true)
    
        return () => {
            document.removeEventListener("keydown", handleCloseElementOnEscapeKey, true)
        }
        
    }, [handleClick])
}
