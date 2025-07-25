import { SubmitFormSchema } from "@/lib/schema";
import { connectToDB } from "@/server/database/connectToDb";
import { Form } from "@/server/database/models/form-model";
import { User } from "@/server/database/models/user-model";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MongooseError } from "mongoose";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const req = await request.json();

    const safeReq = SubmitFormSchema.safeParse(req);

    const user = await getKindeServerSession().getUser();
    const userFromDatabase = await User.findOne({ kindeId: user.id });
    const createdBy = userFromDatabase?._id;

    if (!safeReq.success) {
      return NextResponse.json({
        success: false,
        message: "",
        data: {},
      });
    }

    const {
      productivity,
      hoursWorked,
      hoursPlanned,
      tasksCompleted,
      tasksPlanned,
      sleptWell,
      distractions,
      distractionsList,
      mood,
      followedSchedule,
      hoursSlept,
      version,
      overWork,
    } = safeReq.data;

    const form = await Form.create({
      productivity,
      hoursWorked,
      hoursPlanned,
      tasksCompleted,
      tasksPlanned,
      sleptWell,
      distractions,
      distractionsList,
      mood,
      followedSchedule,
      hoursSlept,
      version,
      overWork,
      createdBy,
    });

    return NextResponse.json({
      message: "Form submitted",
      success: true,
      data: form,
    });
  } catch (error) {
    if (error instanceof MongooseError) {
      return NextResponse.json({
        message: "Database error",
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
      });
    }
    return NextResponse.json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add version",
    });
  }
}
