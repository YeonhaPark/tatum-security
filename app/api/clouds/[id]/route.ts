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

// PATCH /api/clouds/[id] - 클라우드 데이터 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // 파일에서 데이터 읽기
    const json = fs.readFileSync(dataFile, "utf-8");
    const data = JSON.parse(json);

    // ID로 클라우드 찾기
    const cloudIndex = data.findIndex((item: any) => item.id === id);

    if (cloudIndex === -1) {
      return NextResponse.json({ error: "Cloud not found" }, { status: 404 });
    }

    // 데이터 업데이트
    const updatedCloud = {
      ...data[cloudIndex],
      ...body,
      id: id, // ID는 변경하지 않음
      updatedAt: new Date().toISOString(),
    };

    data[cloudIndex] = updatedCloud;

    // 파일에 저장
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json(updatedCloud);
  } catch (error) {
    console.error("Error updating cloud:", error);
    return NextResponse.json(
      { error: "Failed to update cloud" },
      { status: 500 }
    );
  }
}

// DELETE /api/clouds/[id] - 클라우드 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 파일에서 데이터 읽기
    const json = fs.readFileSync(dataFile, "utf-8");
    const data = JSON.parse(json);

    // ID로 클라우드 찾기
    const cloudIndex = data.findIndex((item: any) => item.id === id);

    if (cloudIndex === -1) {
      return NextResponse.json({ error: "Cloud not found" }, { status: 404 });
    }

    // 데이터에서 제거
    const deletedCloud = data.splice(cloudIndex, 1)[0];

    // 파일에 저장
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({
      message: "Cloud deleted successfully",
      id: id,
      deletedCloud,
    });
  } catch (error) {
    console.error("Error deleting cloud:", error);
    return NextResponse.json(
      { error: "Failed to delete cloud" },
      { status: 500 }
    );
  }
}
