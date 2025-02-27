"use client";

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeAuth,
} from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/user-store";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";
import { VersionToggle } from "./version-toggle";

export default function Navbar() {
  const { isAuthenticated } = useKindeAuth();
  const { setUser } = useUserStore();

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <Link className="text-xl" href="/">
        PacePal
      </Link>
      <div className="flex gap-4">
        <ModeToggle />
        <VersionToggle />
        {isAuthenticated ? (
          <>
            <Link href="/me">
              <Button className="px-6">Profile</Button>
            </Link>
            <LogoutLink>
              <Button
                onClick={() => {
                  setUser({
                    email: "",
                    id: "",
                    picture: "",
                    given_name: "",
                    isOnBoarded: false,
                    mongoId: "",
                    versions: [
                      {
                        data: {
                          desiredSleepHours: 0,
                          slots: [],
                        },
                        versionName: "v1",
                      },
                    ],
                  });
                }}
                variant={"secondary"}
                className="px-8"
              >
                Logout
              </Button>
            </LogoutLink>
          </>
        ) : (
          <>
            <LoginLink>
              <Button className="px-8">Login</Button>
            </LoginLink>
            <RegisterLink>
              <Button variant={"secondary"} className="px-6">
                Register
              </Button>
            </RegisterLink>
          </>
        )}
      </div>
    </header>
  );
}
