"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useVersionStore } from "@/store/version-store";
import useGetUser from "@/hooks/use-get-user";
import { type DailyFormData, DailyFormSchema } from "@/lib/schema";
import { api } from "@/trpc/react";

export function DailyForm() {
  const { localUser: user } = useGetUser();

  const { selectedVersion } = useVersionStore();
  const { mutate, data, isPending } = api.form.submitForm.useMutation();
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DailyFormData>({
    resolver: zodResolver(DailyFormSchema),
    defaultValues: {
      followedSchedule: "yes",
      productivity: "",
      tasksCompleted: 0,
      tasksPlanned: 0,
      sleptWell: "yes",
      hoursSlept: 0,
      distractions: "no",
      distractionsList: "",
      mood: "neutral",
      hoursWorked: [],
      overWork: 0,
      selectedVersion: selectedVersion,
      userId: user?.mongoId,
    },
  });

  async function onSubmit(formData: DailyFormData) {
    if (!formData.userId) return;
    setValue("userId", user?.mongoId);

    const hoursPlanned = user.versions
      .find((version) => version.versionName === selectedVersion)
      ?.data.slots.reduce((acc, slot) => {
        return acc + slot.hours;
      }, 0);

    try {
      console.log(`ehe`);
      mutate({
        version: selectedVersion,
        userId: user?.mongoId,
        selectedVersion: selectedVersion,
        distractions: formData.distractions,
        distractionsList: formData.distractionsList,
        mood: formData.mood,
        hoursSlept: formData.hoursSlept,
        overWork: formData.overWork,
        productivity: formData.productivity,
        sleptWell: formData.sleptWell,
        tasksCompleted: formData.tasksCompleted,
        tasksPlanned: formData.tasksPlanned,
        hoursPlanned: hoursPlanned ?? 0,
        hoursWorked: formData.hoursWorked,
        followedSchedule: formData.followedSchedule,
        createdBy: user.mongoId,
      });
      console.log(data);
      if (data?.success) {
        location.reload();
      } else {
        setError(String(data?.message));
      }
    } catch (error) {
      setError(String(error));
      console.error(error);
      alert("Error submitting reflection. Please try again.");
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Daily Reflection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Did you follow the schedule today?</Label>
            <Controller
              name="followedSchedule"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="schedule-yes" />
                    <Label htmlFor="schedule-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="schedule-no" />
                    <Label htmlFor="schedule-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <p>{selectedVersion}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productivity">Rate your productivity (1-10)</Label>
            <Controller
              name="productivity"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.productivity && (
              <p className="text-sm text-red-500">
                {errors.productivity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursWorked">Hours worked</Label>
            <div className="flex flex-wrap gap-2">
              {user?.versions.map((version) => {
                if (version.versionName === selectedVersion) {
                  const slots = version.data.slots;
                  return slots.map((slot) => (
                    <Controller
                      key={`hoursWorked-${slot.name}`}
                      name="hoursWorked"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <div className="flex w-full max-w-[150px] flex-col space-y-1">
                          <Label className="text-xs">
                            {slot.name} - {slot.hours} hours
                          </Label>
                          <Input
                            type="number"
                            step="0.5"
                            placeholder={`${slot.name} hours`}
                            onChange={(e) => {
                              const hours = parseFloat(e.target.value);
                              const newValue = isNaN(hours)
                                ? value.filter(
                                    (item) => item.name !== slot.name,
                                  )
                                : [
                                    ...value.filter(
                                      (item) => item.name !== slot.name,
                                    ),
                                    { name: slot.name, hours: hours },
                                  ];
                              onChange(newValue);
                            }}
                            value={
                              value?.find((item) => item.name === slot.name)
                                ?.hours ?? ""
                            }
                          />
                        </div>
                      )}
                    />
                  ));
                }
                return null;
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tasksCompleted">Tasks completed</Label>
              <Controller
                name="tasksCompleted"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="tasksCompleted"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
              {errors.tasksCompleted && (
                <p className="text-sm text-red-500">
                  {errors.tasksCompleted.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasksPlanned">Tasks planned</Label>
              <Controller
                name="tasksPlanned"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="tasksPlanned"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
              {errors.tasksPlanned && (
                <p className="text-sm text-red-500">
                  {errors.tasksPlanned.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Did you sleep more than{" "}
              {user?.versions.map((version) => {
                if (version.versionName === selectedVersion) {
                  return version.data.desiredSleepHours;
                }
              })}
              hours?
            </Label>
            <Controller
              name="sleptWell"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="sleep-yes" />
                    <Label htmlFor="sleep-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="sleep-no" />
                    <Label htmlFor="sleep-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>How many hours did you sleep?</Label>
            <Controller
              name="hoursSlept"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="hoursSlept"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Any distractions?</Label>
            <Controller
              name="distractions"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="distractions-yes" />
                    <Label htmlFor="distractions-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="distractions-no" />
                    <Label htmlFor="distractions-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distractionsList">
              If yes, list them: (separate with comma)
            </Label>
            <Controller
              name="distractionsList"
              control={control}
              render={({ field }) => (
                <Textarea id="distractionsList" {...field} />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Overwork hours(if any)</Label>
            <Controller
              name="overWork"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="overWork"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">How did you feel today?</Label>
            <Controller
              name="mood"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="tired">Tired</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="stressed">Stressed</SelectItem>
                    <SelectItem value="productive">Productive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {error && <p className="text-red-500">{error}</p>}
        <Button
          className="w-full"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Reflection"}
        </Button>
      </CardFooter>
    </Card>
  );
}
