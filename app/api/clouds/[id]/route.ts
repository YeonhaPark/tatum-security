import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "shared/lib/data/clouds.json");

// GET /api/clouds/[id] - 특정 ID의 클라우드 데이터 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // 파일에서 데이터 읽기
    const json = fs.readFileSync(dataFile, "utf-8");
    const data = JSON.parse(json);

    // ID로 클라우드 찾기
    const cloud = data.find((item: any) => item.id === id);
    console.log({ cloud });
    if (!cloud) {
      return NextResponse.json({ error: "Cloud not found" }, { status: 404 });
    }

    return NextResponse.json(cloud);
  } catch (error) {
    console.error("Error fetching cloud:", error);
    return NextResponse.json(
      { error: "Failed to fetch cloud" },
      { status: 500 }
    );
  }
}

