"use client";

import { useUserStore } from "@/store/user-store";
import { api } from "@/trpc/react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useState, useEffect } from "react";

export default function useGetUser() {
  const { user: localUser, setUser } = useUserStore();
  const [error, setError] = useState("");

  const { getUser, isLoading, isAuthenticated } = useKindeAuth();

  useEffect(() => {
    const user = getUser();

    if (!localUser?.id.length) {
      if (isLoading) {
        setError("loading");
      }
      if (!isAuthenticated) {
        setError("not logged in");
      }
      const fetchUser = async () => {
        const userId = localUser?.id ?? user?.id;

        try {
          const { data } = api.user.me.useQuery(userId);
          if (data?.success === false) {
            setError("User not logged in");
            return;
          }
          if (data) {
            setUser({
              email: data.user.email,
              id: String(data.user.kindeId),
              picture: data.user.picture,
              given_name: data.user.given_name,
              isOnBoarded: data.user.isOnBoarded,
              mongoId: String(data.user._id),
              versions: data.user.versions,
            });
          }
        } catch (error) {
          setError("error in getLoggedInUser");
          console.error(error);
        }
      };

      void fetchUser();
    }
  }, [setUser, isLoading, getUser, localUser, isAuthenticated]);

  return { localUser, error };
}
