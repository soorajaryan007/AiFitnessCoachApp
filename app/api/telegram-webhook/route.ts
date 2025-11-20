import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Temporary in-memory storage (use DB later)
let chatIDs: string[] = [];

export async function POST(req: NextRequest) {
  const body = await req.json();

  const chatId = body.message?.chat?.id;
  const text = body.message?.text;

  if (chatId && !chatIDs.includes(chatId)) {
    chatIDs.push(chatId);
  }

  if (text === "/start") {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Welcome! You will now receive your daily fitness plan here 💪🔥",
      }),
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ chatIDs });
}
