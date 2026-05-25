import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      recipientName,
      companyName,
      purpose,
      tone,
      background,
    } = body;

    const prompt = `
You are an expert cold outreach email writer.

Write a concise outreach email.

Recipient Name: ${recipientName}
Company Name: ${companyName}
Purpose: ${purpose}
Tone: ${tone}
Background: ${background}

Rules:
- Keep under 150 words
- Sound human
- Avoid buzzwords
- Clear CTA
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional outreach email assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const email =
      completion.choices[0].message.content;

    return Response.json({
      success: true,
      email,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}