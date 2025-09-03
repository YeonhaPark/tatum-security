import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "shared/lib/data/clouds.json");

export async function GET() {
  const json = fs.readFileSync(dataFile, "utf-8");
  const data = JSON.parse(json);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const json = fs.readFileSync(dataFile, "utf-8");
  const data = JSON.parse(json);

  const newItem = {
    id: String(Date.now()), // 간단한 id
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.push(newItem);

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json(newItem, { status: 201 });
}
