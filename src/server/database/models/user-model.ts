import mongoose from "mongoose";

type User = {
  email: string;
  kindeId: string;
  picture: string;
  given_name: string;
  isOnBoarded: boolean;
  versions: {
    versionName: string;
    data: {
      slots: {
        name: string;
        hours: number;
      }[];
      desiredSleepHours: number;
    };
  }[];
};

const userSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
  },
  kindeId: {
    type: String,
    required: true,
    unique: true,
  },
  picture: { type: String },
  given_name: { type: String },
  isOnBoarded: { type: Boolean, default: false },
  versions: [
    {
      versionName: { type: String, required: true, unique: true },
      data: {
        slots: { type: Array, default: [] },
        desiredSleepHours: { type: Number, required: true },
      },
    },
  ],
});

const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", userSchema);
export { User };
