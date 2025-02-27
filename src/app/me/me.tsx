"use client";

import { CardContent } from "@/components/ui/card";
import { PencilIcon, SaveIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Loader } from "@/components/loading";
import useGetUser from "@/hooks/use-get-user";
import { useUserStore } from "@/store/user-store";
import { useVersionStore } from "@/store/version-store";
import { useEffect, useState } from "react";

export default function Me() {
  const [isEditingSleep, setIsEditingSleep] = useState(false);

  const [loading, setLoading] = useState(true);
  const [desiredSleepHours, setDesiredSleepHours] = useState("");

  const [totalHours, setTotalHours] = useState(0);

  const [isEditingSlots, setIsEditingSlots] = useState(false);
  const [editableSlots, setEditableSlots] = useState<
    Array<{ name: string; hours: number }>
  >([]);

  const { localUser } = useGetUser();
  const { setUser } = useUserStore();
  const { selectedVersion } = useVersionStore();

  const handleSaveSleepHours = async () => {
    try {
      // const hours = parseFloat(desiredSleepHours);
      // if (isNaN(hours) || hours < 0 || hours > 24) {
      //   alert("Please enter a valid number of sleep hours (0-24)");
      //   return;
      // }
      // const { data } = await axios.post("/api/update-user-sleeping-hrs", {
      //   id: localUser?.mongoId,
      //   desiredSleepHours: hours,
      //   version: selectedVersion,
      // });
      // if (data.success) {
      //   setIsEditingSleep(false);
      //   setUser({
      //     versions: data.data.versions,
      //     email: localUser?.email as string,
      //     id: localUser?.mongoId as string,
      //     picture: localUser?.picture as string,
      //     given_name: localUser?.given_name as string,
      //     isOnBoarded: true,
      //     mongoId: localUser?.mongoId as string,
      //   });
      //   setIsEditingSleep(false);
      // }
    } catch (error) {
      console.error("Failed to update sleep hours", error);
      alert("Failed to update sleep hours");
    }
  };

  const handleSaveSlots = async () => {
    try {
      // const validSlots = editableSlots.filter(
      //   (slot) =>
      //     slot.name.trim() !== "" &&
      //     !isNaN(parseFloat(String(slot.hours))) &&
      //     parseFloat(String(slot.hours)) >= 0 &&
      //     parseFloat(String(slot.hours)) <= 24,
      // );
      // if (validSlots.length !== editableSlots.length) {
      //   alert("Please ensure all slots have a valid name and hours (0-24)");
      //   return;
      // }
      // const { data } = await axios.post("/api/update-user-slots", {
      //   id: localUser?.mongoId,
      //   slots: validSlots,
      //   version: selectedVersion,
      // });
      // if (data.success) {
      //   setUser({
      //     versions: data.data.versions,
      //     email: localUser?.email as string,
      //     id: localUser?.mongoId as string,
      //     picture: localUser?.picture as string,
      //     given_name: localUser?.given_name as string,
      //     isOnBoarded: true,
      //     mongoId: localUser?.mongoId as string,
      //   });
      //   setIsEditingSlots(false);
      //   return;
      // }
    } catch (error) {
      console.error("Failed to update slots", error);
      alert("Failed to update slots");
    }
  };

  const handleAddSlot = () => {
    setEditableSlots([...editableSlots, { name: "", hours: 0 }]);
  };

  const handleRemoveSlot = (indexToRemove: number) => {
    setEditableSlots(
      editableSlots.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleUpdateSlot = (
    index: number,
    field: "name" | "hours",
    value: string | number,
  ) => {
    const updatedSlots = [...editableSlots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value,
    } as { name: string; hours: number };
    setEditableSlots(updatedSlots);
  };

  useEffect(() => {
    if (!localUser?.id) {
      setLoading(true);
      return;
    }

    const hrs = localUser.versions.map((version) => {
      if (version.versionName === selectedVersion) {
        return version.data.desiredSleepHours;
      }
    });

    const slots =
      localUser.versions
        .filter((version) => version.versionName === selectedVersion)
        .map((version) => version.data.slots)[0] ?? [];

    if (localUser?.id) {
      setLoading(false);
      setDesiredSleepHours(String(hrs));
      setEditableSlots(slots);
    }
  }, [localUser, selectedVersion]);

  useEffect(() => {
    let total = 0;
    editableSlots.map((slot) => {
      total = total + slot.hours;
    });

    setTotalHours(total);
  }, [editableSlots]);

  if (loading) return <Loader />;

  return (
    <CardContent className="flex">
      <div className="my-2 flex w-[25%] flex-col items-center border-r">
        <div>
          <Image
            src={String(localUser?.picture)}
            width={208}
            height={208}
            className="rounded-full"
            alt="avatar"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">{localUser?.given_name}</h1>
          <p className="text-md text-gray-300">{localUser?.email}</p>
        </div>
      </div>
      <div className="w-[75%] space-y-4 p-4">
        <h1>Edit your info</h1>

        {/* Desired Sleep Hours Section */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-md text-zinc-300">Desired Sleeping hours</p>
              {isEditingSleep ? (
                <Input
                  type="number"
                  value={desiredSleepHours}
                  onChange={(e) => setDesiredSleepHours(e.target.value)}
                  className="mr-2 w-20"
                  min="0"
                  max="24"
                  step="0.5"
                />
              ) : (
                <p className="text-lg">
                  {
                    localUser?.versions.find(
                      (version) => version.versionName === selectedVersion,
                    )?.data.desiredSleepHours
                  }
                </p>
              )}
            </div>
            {isEditingSleep ? (
              <Button
                size="icon"
                variant="outline"
                onClick={handleSaveSleepHours}
              >
                <SaveIcon size={15} />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsEditingSleep(true)}
              >
                <PencilIcon size={15} />
              </Button>
            )}
          </div>
        </div>

        {/* Slots Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Slots</h2>
            {!isEditingSlots ? (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsEditingSlots(true)}
              >
                <PencilIcon size={15} />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleAddSlot}>
                  Add Slot
                </Button>
                <Button size="icon" variant="outline" onClick={handleSaveSlots}>
                  <SaveIcon size={15} />
                </Button>
              </div>
            )}
          </div>

          {isEditingSlots ? (
            <div className="space-y-2">
              {editableSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Slot Name"
                    value={slot.name}
                    onChange={(e) =>
                      handleUpdateSlot(index, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Hours"
                    value={slot.hours}
                    onChange={(e) =>
                      handleUpdateSlot(
                        index,
                        "hours",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-20"
                    min="0"
                    max="24"
                    step="0.5"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveSlot(index)}
                  >
                    <TrashIcon size={15} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {editableSlots?.map((slot, index) => (
                <div key={index} className="flex justify-between">
                  <span>{slot.name}</span>
                  <span>{slot.hours} hours</span>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span>Total Working Hours</span>
                <span>{totalHours} hours</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  );
}
