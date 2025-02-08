import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest, response: NextResponse) { 
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 401 }
      );
    }
    console.log("user: " + user);

    const validPassword = await compare(password, user.password)

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    }

    const token = jwt.sign(
      tokenData,
      process.env.TOKEN_SECRET!,
      { expiresIn: "1d" },
    );

    const response = NextResponse.json({ message: "Login successful", success: true });
    
    response.cookies.set("token", token, { httpOnly: true });
    
    return response;

  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}