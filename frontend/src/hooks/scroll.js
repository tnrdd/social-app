import React, { useState } from "react";
import debounce from "../utils/debounce";

function useScrollHandler(props) {
  const [batch, setBatch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  window.onscroll = debounce(() => {
    if (isLoading || allLoaded) {
      return;
    }

    if (
      window.innerHeight + window.pageYOffset ===
      document.body.scrollHeight
    ) {
      setBatch(batch + 1);
    }
  }, 100);

  return [batch, setBatch, isLoading, setIsLoading, setAllLoaded];
}

export default useScrollHandler;
