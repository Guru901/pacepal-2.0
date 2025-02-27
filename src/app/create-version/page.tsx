import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import VersionForm from "./version-form";

export default function ScheduleVersionCreator() {
  return (
    <main className="flex flex-col gap-10">
      <Navbar />
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create New Schedule Version
          </CardTitle>
        </CardHeader>
        <VersionForm />
      </Card>
    </main>
  );
}
