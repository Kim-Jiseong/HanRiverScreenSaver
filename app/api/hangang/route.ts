import { NextResponse, userAgent } from "next/server";
import axios from "axios";
export async function GET() {
  try {
    const response = await axios.get("https://api.ivl.is/hangangtemp");

    return new NextResponse(JSON.stringify(response.data), {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "한강 수온 데이터를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
