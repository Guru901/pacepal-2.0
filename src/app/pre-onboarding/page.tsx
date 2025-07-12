"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreOnboarding() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);

        const isOnBoarded = localStorage.getItem("isOnBoarded");

        if (isOnBoarded === "true") {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-xl">Loading....</h1>
    </div>
  ) : (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-xl">Redirecting....</h1>
    </div>
  );
}
