import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const chatFile = path.join(process.cwd(), "data/chats.json");

export async function GET() {
  const chats: number[] = JSON.parse(fs.readFileSync(chatFile, "utf8"));

  for (const chat of chats) {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: "🔥 Your Daily Fitness Plan:\n\n🏋️ Workout: ...\n🥗 Meal: ...\n💡 Motivation: ...",
        }),
      }
    );
  }

  return NextResponse.json({ sent: chats.length });
}
