import mongoose from "mongoose";

type Form = {
  followedSchedule: boolean;
  productivity: string;
  hoursWorked: {
    name: string;
    hours: number;
  }[];
  hoursPlanned: number;
  tasksCompleted: number;
  tasksPlanned: number;
  sleptWell: string;
  distractions: string;
  notes: string;
  userId: string;
  version: string;
  distractionsList: string;
  mood: string;
  overWork: number;
  hoursSlept: number;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const formSchema = new mongoose.Schema<Form>(
  {
    followedSchedule: {
      type: Boolean,
      default: false,
    },
    productivity: {
      type: String,
      default: "",
    },
    hoursWorked: {
      type: [
        {
          name: String,
          hours: Number,
        },
      ],
      default: [],
    },
    hoursPlanned: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    tasksPlanned: {
      type: Number,
      default: 0,
    },
    sleptWell: {
      type: String,
      enum: ["yes", "no"],
      default: "yes",
    },
    distractions: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    distractionsList: {
      type: String,
      default: "",
    },
    mood: {
      type: String,
      enum: ["happy", "tired", "neutral", "stressed", "productive"],
      default: "neutral",
    },
    overWork: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hoursSlept: {
      type: Number,
      default: 0,
    },
    version: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Form =
  (mongoose.models.Form as mongoose.Model<Form>) ||
  mongoose.model("Form", formSchema);

export { Form };
