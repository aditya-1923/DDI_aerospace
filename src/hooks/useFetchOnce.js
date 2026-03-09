import { useState, useEffect, useRef } from "react";

export const useFetchOnce = (fetchFunc, deps = [], retries = 0, retryDelay = 1000) => {
  const fetchedRef = useRef(false);
  const abortControllerRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fetchedRef.current) return; // prevent duplicate fetch
    fetchedRef.current = true;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchData = async (attempt = 0) => {
      setLoading(true);
      try {
        const res = await fetchFunc({ signal }); // fetchFunc returns real data
        setData(res);
        setError("");
      } catch (err) {
        if (signal.aborted) return;
        if (attempt < retries) {
          setTimeout(() => fetchData(attempt + 1), retryDelay);
        } else {
          console.error(err);
          setError(err.message || "Failed to fetch data");
        }
      } finally {
        setLoading(false); // always stop loading
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};
