import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const chatFile = path.join(dataDir, "chats.json");

// Ensure /data exists
function ensureDataFolder() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
}

// Save chat
function saveChatId(id: number) {
  ensureDataFolder();
  let data: number[] = [];

  if (fs.existsSync(chatFile)) {
    data = JSON.parse(fs.readFileSync(chatFile, "utf8"));
  }

  if (!data.includes(id)) {
    data.push(id);
    fs.writeFileSync(chatFile, JSON.stringify(data));
  }
}

// Remove chat
function removeChatId(id: number) {
  ensureDataFolder();
  let data: number[] = [];

  if (fs.existsSync(chatFile)) {
    data = JSON.parse(fs.readFileSync(chatFile, "utf8"));
  }

  const newList = data.filter((c) => c !== id);
  fs.writeFileSync(chatFile, JSON.stringify(newList));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const msg = body.message;

  if (!msg?.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = msg.chat.id;
  const text = msg.text.trim();

  // ---------------------------
  // START COMMAND
  // ---------------------------
  if (text === "/start") {
    saveChatId(chatId);

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Welcome! 🎉\nYou will now receive daily fitness updates here.",
        }),
      }
    );

    return NextResponse.json({ ok: true });
  }

  // ---------------------------
  // STOP COMMAND
  // ---------------------------
  if (text === "/stop") {
    removeChatId(chatId);

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "You have been unsubscribed ❌",
        }),
      }
    );

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
