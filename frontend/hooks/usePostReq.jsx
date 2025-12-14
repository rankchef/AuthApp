import { useState } from "react";

export default function usePostReq() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postReq = async (url, payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
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

  return { postReq, loading, error };
}
