"use client";

import useGetUser from "@/hooks/useGetUser";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreOnboarding() {
  const user = useKindeAuth().user;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { localUser } = useGetUser();

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        if (localUser) {
          if (localUser.isOnBoarded) {
            router.push(`/`);
          } else {
            router.push(`/onboarding`);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, localUser, router]);

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-xl">Redirecting....</h1>
    </div>
  );
}
