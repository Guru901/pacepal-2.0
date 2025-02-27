"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import useGetUser from "@/hooks/use-get-user";
import {
  type OnboardingFormData,
  OnBoardingFormSchema as OnboardingFormSchema,
} from "@/lib/schema";
import { api } from "@/trpc/react";

export function OnboardingForm() {
  const [totalSlotHours, setTotalSlotHours] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const router = useRouter();

  const { user, isLoading } = useKindeAuth();
  const { mutate, data } = api.user.onboardUser.useMutation();

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      desiredSleepHours: 8,
      slots: [{ name: "", hours: 0 }],
      version: "v1",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  const { localUser } = useGetUser();
  const watchForm = watch();

  useEffect(() => {
    const slotsTotal = watchForm.slots.reduce(
      (sum, slot) => sum + (parseFloat(slot.hours?.toString() || "0") || 0),
      0,
    );
    setTotalSlotHours(slotsTotal);
  }, [watchForm]);

  const onSubmit = (data: OnboardingFormData) => {
    setFormData(data);
    setIsDialogOpen(true);
  };

  async function handleFinalSubmit() {
    try {
      setBtnLoading(true);
      mutate({
        email: String(user?.email),
        id: String(user?.id),
        picture: String(user?.picture),
        given_name: String(user?.given_name),
        isOnBoarded: true,
        slots: formData?.slots ?? [],
        desiredSleepHours: Number(formData?.desiredSleepHours),
        version: String(formData?.version),
      });

      if (data?.success) {
        router.push("/");
      }
      setBtnLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    void (async () => {
      setLoading(true);
      if (!user) return;
      if (!user.email) return;
      if (!user.id) return;
      if (!user.given_name) return;

      if (localUser?.isOnBoarded) {
        router.push(`/`);
        setLoading(false);
      }

      setLoading(false);
    })();
  }, [user, localUser, router]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            type="string"
            id="version"
            {...register("version")}
            placeholder={"Enter version"}
          />
          {errors.version && (
            <p className="text-sm text-red-500">{errors.version.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="desiredSleepHours">Desired Sleep Hours</Label>
          <Controller
            name="desiredSleepHours"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                id="desiredSleepHours"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
          {errors.desiredSleepHours && (
            <p className="text-sm text-red-500">
              {errors.desiredSleepHours.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Slots</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Controller
                name={`slots.${index}.name`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Slot name"
                    className="flex-grow"
                  />
                )}
              />
              <Controller
                name={`slots.${index}.hours`}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    placeholder="Hours"
                    className="w-20"
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className={`flex-shrink-0 ${
                  fields.length === 1
                    ? "text-gray-400"
                    : "text-red-500 hover:text-red-700"
                }`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {errors.slots && (
            <p className="text-sm text-red-500">{errors.slots.message}</p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", hours: 0 })}
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Slot
        </Button>

        <div className="flex items-center justify-between font-semibold">
          <span>Total Slot Hours:</span>
          <span>{totalSlotHours}</span>
        </div>
        <div className="flex items-center justify-between font-semibold">
          <span>Total Planned Hours (including sleep):</span>
          <span>{totalSlotHours + (watchForm.desiredSleepHours || 0)}</span>
        </div>
      </form>
      <CardFooter className="px-0">
        <Button className="w-full" onClick={handleSubmit(onSubmit)}>
          Review Plan
        </Button>
      </CardFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daily Plan Summary</DialogTitle>
            <DialogDescription>
              Review your daily plan before submitting.
            </DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="space-y-4">
              <div>
                <strong>Desired Sleep Hours:</strong>{" "}
                {formData.desiredSleepHours}
              </div>
              <div>
                <strong>Planned Slots:</strong>
                <ul className="list-inside list-disc">
                  {formData.slots.map((slot, index) => (
                    <li key={index}>
                      {slot.name}: {slot.hours} hours
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Total Slot Hours:</strong> {totalSlotHours}
              </div>
              <div>
                <strong>Total Planned Hours (including sleep):</strong>{" "}
                {totalSlotHours + (formData.desiredSleepHours || 0)}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button disabled={btnLoading} onClick={handleFinalSubmit}>
              {btnLoading ? "Submitting..." : "Submit Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
