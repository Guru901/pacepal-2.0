"use client";

import { DailyForm } from "@/components/daily-form";
import Navbar from "@/components/navbar";
import { useEffect } from "react";
import useGetUser from "@/hooks/useGetUser";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Dashboard() {
  const { localUser: user } = useGetUser();
  const { selectedVersion } = useVersionStore();

  const { setSelectedVersion } = useVersionStore();

  const { data, isLoading, isPending } = api.form.isFormSubmitted.useQuery();

  useEffect(() => {
    const selectedVersion = localStorage.getItem("selected-version");
    if (selectedVersion) {
      setSelectedVersion(selectedVersion);
    }
  }, [selectedVersion, setSelectedVersion]);

  if (isLoading || isPending || !user?.id) return <Loader />;

  return (
    <main className="relative min-h-screen w-screen">
      <Navbar />
      <div
        className={data?.data.isFormSubmitted ? "" : "h-[90vh] overflow-hidden"}
      >
        <div className="mx-4 flex flex-col gap-2">
          <SleepChart selectedVersion={selectedVersion} />
          <TodosChart selectedVersion={selectedVersion} />
          <WorkChart selectedVersion={selectedVersion} />
          <div className="flex gap-2">
            <MoodChart selectedVersion={selectedVersion} />
            <div className="flex w-1/2 gap-2">
              <Penalty selectedVersion={selectedVersion} />
              <OverworkChart selectedVersion={selectedVersion} />
            </div>
          </div>
          <div className="flex gap-2">
            <DistractionsChart selectedVersion={selectedVersion} />
            <ProductivityChart selectedVersion={selectedVersion} />
          </div>
        </div>
      </div>

      {!data?.data.isFormSubmitted && (
        <div className="absolute inset-0 flex min-h-screen translate-y-36 items-center justify-center bg-black/50">
          <DailyForm />
        </div>
      )}
    </main>
  );
}
