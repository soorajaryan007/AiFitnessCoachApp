import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // required on vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body?.message;
    const chatId = message?.chat?.id;
    const text = message?.text?.trim();

    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    // Handle /start command
    if (text === "/start") {
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Welcome! 🎉\nYou will now receive fitness updates here.",
          }),
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}

// Prevent GET error
export async function GET() {
  return NextResponse.json({ ok: true });
}
