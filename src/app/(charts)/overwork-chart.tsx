import React from "react";
import { Loader } from "@/components/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export function OverworkChart({
  userId,
  selectedVersion,
}: {
  userId: string;
  selectedVersion: string;
}) {
  const [loading, setLoading] = useState(true);
  const [overWork, setOverWork] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        // setLoading(true);
        // const { data } = await axios.get(
        //   `/api/get-overwork-data?id=${userId}&version=${selectedVersion}`,
        // );
        // setOverWork(data.data.overWork);
      } catch (error) {
        console.error(error);
        setOverWork(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedVersion, userId]);

  return (
    <Card className="w-1/2">
      <CardHeader className="flex h-[25%] items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Overwork</CardTitle>
          <CardDescription>
            Hours you worked over your desired hours
          </CardDescription>
        </div>
      </CardHeader>
      {loading ? (
        <Loader />
      ) : (
        <CardContent className="flex h-[75%] w-full items-center justify-center">
          <h1 className="text-4xl">{overWork}</h1>
        </CardContent>
      )}
    </Card>
  );
}
