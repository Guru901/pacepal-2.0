"use client";

import { DailyForm } from "@/components/daily-form";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
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

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setSelectedVersion } = useVersionStore();

  useEffect(() => {
    void (async () => {
      try {
        const userID = user?.mongoId.replaceAll(" ", "_");
        setLoading(true);

        if (!userID) return;

        const { data } = api.form.isFormSubmitted.useQuery(userID);

        if (data?.success) {
          if (data.data.isFormSubmitted) {
            setIsFormSubmitted(true);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.mongoId, isFormSubmitted]);

  useEffect(() => {
    const selectedVersion = localStorage.getItem("selected-version");
    if (selectedVersion) {
      setSelectedVersion(selectedVersion);
    }
  }, [selectedVersion, setSelectedVersion]);

  if (loading || !user?.id) return <Loader />;
  return (
    <main>
      <Navbar />
      {!isFormSubmitted ? (
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
            <div className="flex gap-2">
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
