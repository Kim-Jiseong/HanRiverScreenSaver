import { NextResponse, userAgent } from "next/server";
import axios from "axios";
export async function GET() {
  try {
    const response = await axios.get("https://api.ivl.is/hangangtemp");
    console.log(response.data)
    return NextResponse.json(response.data)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "한강 수온 데이터를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
