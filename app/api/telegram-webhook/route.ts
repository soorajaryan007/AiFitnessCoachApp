import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message?.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    // Load existing chat list from env
    let chatList: number[] = [];

    if (process.env.CHAT_IDS) {
      try {
        chatList = JSON.parse(process.env.CHAT_IDS);
      } catch {}
    }

    // START COMMAND
    if (text === "/start") {
      if (!chatList.includes(chatId)) {
        chatList.push(chatId);
      }

      // ⭐ Update environment variable (requires redeploy)
      console.log("SAVE CHAT LIST:", chatList);

      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text:
              "Welcome! 🎉\nYou are now subscribed to receive daily fitness plans every morning.\n\nType /stop to unsubscribe.",
          }),
        }
      );
    }

    // STOP COMMAND
    if (text === "/stop") {
      chatList = chatList.filter((id) => id !== chatId);

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
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ ok: false });
  }
}
