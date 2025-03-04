import { Loader } from "@/components/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePenaltyData } from "@/hooks/useChartData";

export function Penalty({ selectedVersion }: { selectedVersion: string }) {
  const { data, isLoading } = usePenaltyData(selectedVersion);

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
      {isLoading ? (
        <Loader />
      ) : (
        <CardContent className="flex h-[75%] w-full items-center justify-center">
          <h1 className="text-4xl">{data?.data.penalty}</h1>
        </CardContent>
      )}
    </Card>
  );
}
