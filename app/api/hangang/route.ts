import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.ivl.is/hangangtemp");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "한강 수온 데이터를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
