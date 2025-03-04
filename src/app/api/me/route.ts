import { connectToDB } from "@/server/database/connectToDb";
import { User } from "@/server/database/models/user-model";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const { id } = await getKindeServerSession().getUser();

  const user = await User.findOne({ id });

  if (!user) {
    return NextResponse.json(
      {
        message: "User not saved yet",
        success: false,
        user: {
          email: "",
          id: "",
          picture: "",
          given_name: "",
          isOnBoarded: false,
          mongoId: "",
          versions: [],
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "User Found",
    user: {
      email: user.email,
      id: user.kindeId,
      picture: user.picture,
      given_name: user.given_name,
      isOnBoarded: user.isOnBoarded,
      mongoId: user._id,
      versions: user.versions,
      kindeId: user.kindeId,
      _id: user._id,
    },
  });
}
