import { useState } from "react";

export default function useGetReq() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getReq = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include"
      });

      const resData = await response.json();

      if (!response.ok) {
        setError(resData);
      }

      setLoading(false);
      return { status: response.status, data: resData };
    } catch (err) {
      setLoading(false);
      const fallback = { errorMessage: "Something went wrong." };
      setError(fallback);
      return { status: 500, data: fallback };
    }
  };

  return { getReq, loading, error };
}
