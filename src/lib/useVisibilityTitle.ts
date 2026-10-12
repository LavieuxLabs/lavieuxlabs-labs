import { useEffect } from "react";

/**
 * While the tab is in the background, shows `standbyTitle` as the document title; on return it
 * restores the title the page had. If the page changed its own title meanwhile, that one is kept.
 */
export function useVisibilityTitle(standbyTitle: string) {
  useEffect(() => {
    let saved: string | null = null;
    const onChange = () => {
      if (document.visibilityState === "hidden") {
        saved = document.title;
        document.title = standbyTitle;
      } else if (saved !== null) {
        if (document.title === standbyTitle) document.title = saved;
        saved = null;
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => {
      document.removeEventListener("visibilitychange", onChange);
      if (saved !== null && document.title === standbyTitle) document.title = saved;
    };
  }, [standbyTitle]);
}
