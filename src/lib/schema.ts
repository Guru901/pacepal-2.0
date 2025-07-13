import * as z from "zod";

export const SlotSchema = z.object({
  name: z.string().min(1, "Slot name is required"),
  hours: z
    .number()
    .min(0, "Hours must be 0 or greater")
    .max(24, "Hours cannot exceed 24"),
});

export const OnBoardingFormSchema = z.object({
  desiredSleepHours: z
    .number()
    .min(4, "Sleep hours must be 4 or greater")
    .max(24, "Sleep hours cannot exceed 24"),
  slots: z.array(SlotSchema),
  version: z.string(),
});

export type OnboardingFormData = z.infer<typeof OnBoardingFormSchema>;

export const StudySlotSchema = z.object({
  name: z.string().min(1, "Slot name is required"),
  hours: z
    .number()
    .min(0.5, "Study time must be at least 30 minutes")
    .max(24, "Study time cannot exceed 24 hours"),
});

export const ScheduleSchema = z.object({
  versionName: z
    .string()
    .min(1, "Version name is required")
    .max(50, "Version name must be 50 characters or less"),
  desiredSleepHours: z
    .number()
    .min(4, "Sleep hours must be at least 4")
    .max(12, "Sleep hours cannot exceed 12"),
  studySlots: z
    .array(StudySlotSchema)
    .min(1, "At least one study slot is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type ScheduleFormData = z.infer<typeof ScheduleSchema>;

export const DailyFormSchema = z.object({
  followedSchedule: z.enum(["yes", "no"]),
  productivity: z.string().min(1, "Please select a productivity rating"),
  tasksCompleted: z
    .number()
    .int()
    .min(1, "Tasks completed must be 1 or greater"),
  selectedVersion: z.string().min(1, "Please select a version"),
  tasksPlanned: z.number().int().min(1, "Tasks planned must be 0 or greater"),
  sleptWell: z.enum(["yes", "no"]),
  distractions: z.enum(["yes", "no"]),
  distractionsList: z.string().optional(),
  mood: z.enum(["happy", "tired", "neutral", "stressed", "productive"]),
  hoursSlept: z.number().min(4, "Hours slept must be 4 or greater"),
  hoursWorked: z.array(z.object({ name: z.string(), hours: z.number() })),
  overWork: z.number().min(0),
});

export type DailyFormData = z.infer<typeof DailyFormSchema>;

export const GetChartsDataSchema = z.object({
  version: z.string().min(1, "Version is required"),
});

export const OnBoardUserSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  picture: z.string().min(1, "Picture is required"),
  given_name: z.string().min(1, "Given name is required"),
  isOnBoarded: z.boolean(),
  slots: z.array(SlotSchema),
  desiredSleepHours: z.number(),
  version: z.string().min(1, "Version is required"),
});

export const SubmitFormSchema = z.object({
  productivity: z.string().min(1, "Please select a productivity rating"),
  tasksCompleted: z
    .number()
    .int()
    .min(1, "Tasks completed must be 1 or greater"),
  tasksPlanned: z.number().int().min(1, "Tasks planned must be 1 or greater"),
  sleptWell: z.enum(["yes", "no"]),
  distractions: z.enum(["yes", "no"]),
  distractionsList: z.string().optional(),
  mood: z.enum(["happy", "tired", "neutral", "stressed", "productive"]),
  hoursSlept: z.number().min(4, "Hours slept must be 4 or greater"),
  hoursWorked: z.array(z.object({ name: z.string(), hours: z.number() })),
  overWork: z.number().min(0),
  hoursPlanned: z.number().int().min(1, "Hours planned must be 1 or greater"),
  followedSchedule: z.enum(["yes", "no"]),
  version: z.string().min(1, "Version is required"),
});

export const UpdateSlotsSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  slots: z.array(SlotSchema),
  version: z.string().min(1, "Version is required"),
});

export const UpdateSleepSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  desiredSleepHours: z.number().min(6, "Minimum sleep hours is 6"),
  version: z.string().min(1, "Version is required"),
});
