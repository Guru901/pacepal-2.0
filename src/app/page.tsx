"use client";

import { DailyForm } from "@/components/daily-form";
import Navbar from "@/components/navbar";
import { useEffect } from "react";
import useGetUser from "@/hooks/use-get-user";
import { Loader } from "@/components/loading";
import { SleepChart } from "./(charts)/sleep-chart";
import { TodosChart } from "./(charts)/todos-chart";
import { WorkChart } from "./(charts)/work-chart";
import { MoodChart } from "./(charts)/mood-chart";
import { Penalty } from "./(charts)/penalty";
import { OverworkChart } from "./(charts)/overwork-chart";
import { DistractionsChart } from "./(charts)/distractions-chart";
import { ProductivityChart } from "@/app/(charts)/productivity-chart";
import { useVersionStore } from "@/store/version-store";
import { api } from "@/trpc/react";

export default function Dashboard() {
  const { localUser: user } = useGetUser();
  const { selectedVersion } = useVersionStore();

  const { setSelectedVersion } = useVersionStore();

  const userID = user?.mongoId.replaceAll(" ", "_");
  const { data, isLoading, isPending } =
    api.form.isFormSubmitted.useQuery(userID);

  useEffect(() => {
    const selectedVersion = localStorage.getItem("selected-version");
    if (selectedVersion) {
      setSelectedVersion(selectedVersion);
    }
  }, [selectedVersion, setSelectedVersion]);

  if (isLoading || isPending || !user?.id) return <Loader />;

  return (
    <main>
      <Navbar />
      {!data?.data.isFormSubmitted ? (
        <div>
          <DailyForm />
        </div>
      ) : (
        <div className="mx-4 flex flex-col gap-2">
          <SleepChart
            userId={String(user?.mongoId)}
            selectedVersion={selectedVersion}
          />
          <TodosChart
            userId={String(user?.mongoId)}
            selectedVersion={selectedVersion}
          />
          <WorkChart
            userId={String(user?.mongoId)}
            selectedVersion={selectedVersion}
          />
          <div className="flex gap-2">
            <MoodChart
              userId={String(user?.mongoId)}
              selectedVersion={selectedVersion}
            />
            <div className="flex w-1/2 gap-2">
              <Penalty
                userId={String(user?.mongoId)}
                selectedVersion={selectedVersion}
              />
              <OverworkChart
                userId={String(user?.mongoId)}
                selectedVersion={selectedVersion}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <DistractionsChart
              userId={String(user?.mongoId)}
              selectedVersion={selectedVersion}
            />
            <ProductivityChart
              userId={String(user?.mongoId)}
              selectedVersion={selectedVersion}
            />
          </div>
        </div>
      )}
    </main>
  );
}
