import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const chatFile = path.join(process.cwd(), "data/chats.json");

function saveChatId(id: number) {
  let data: number[] = [];

  if (fs.existsSync(chatFile)) {
    data = JSON.parse(fs.readFileSync(chatFile, "utf8"));
  }

  if (!data.includes(id)) {
    data.push(id);
    fs.writeFileSync(chatFile, JSON.stringify(data));
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message;

  if (!message?.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  if (text === "/start") {
    saveChatId(chatId);

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Welcome! 🎉\n\nYou will now receive daily fitness plans automatically here on Telegram.",
        }),
      }
    );
  }

  return NextResponse.json({ ok: true });
}
