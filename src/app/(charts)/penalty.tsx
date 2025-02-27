import { Loader } from "@/components/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

export function Penalty({
  userId,
  selectedVersion,
}: {
  userId: string;
  selectedVersion: string;
}) {
  const [penalty, setPenalty] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const { data } = api.charts.getPenaltyData.useQuery({
          id: userId,
          version: selectedVersion,
        });
        if (data) {
          setPenalty(data.data.penalty);
        }
      } catch (error) {
        console.error(error);
        setPenalty(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, selectedVersion]);

  return (
    <Card className="w-1/2">
      <CardHeader className="flex h-[25%] items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Penalty</CardTitle>
          <CardDescription>
            Spend this money only on work related stuff
          </CardDescription>
        </div>
      </CardHeader>
      {loading ? (
        <Loader />
      ) : (
        <CardContent className="flex h-[75%] w-full items-center justify-center">
          <h1 className="text-4xl">{penalty}</h1>
        </CardContent>
      )}
    </Card>
  );
}
