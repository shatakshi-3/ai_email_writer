import OpenAI from "openai";

// Helper to simulate latency for mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate a high-quality mock email based on input parameters
function generateMockEmail(
  recipientName: string,
  companyName: string,
  purpose: string,
  tone: string,
  background: string
): string {
  const recipient = recipientName || "there";
  const company = companyName || "your team";
  const goal = purpose || "discuss mutual synergies";
  const bg = background || "a passionate professional in the industry";

  const subjects: Record<string, string> = {
    professional: `Exploring Collaboration Opportunities - ${company}`,
    friendly: `Hello from a fan of ${company}! 👋`,
    confident: `Accelerating growth at ${company} - Let's connect`,
    casual: `Quick question re: ${company} ☕`,
  };

  const subject = subjects[tone] || subjects.professional;

  let body = "";

  if (tone === "friendly") {
    body = `Hi ${recipient},

Hope you're having an awesome week! 

I've been following ${company} for a while now and am absolutely loving how you're tackling ${goal}. As someone with a background in ${bg}, I really appreciate the unique approach your team is taking.

I'd love to connect for a quick 10-minute chat to learn more about your journey and share a couple of ideas that might be helpful. Would you be open to a casual virtual coffee next Tuesday?

Best,

[Your Name]`;
  } else if (tone === "confident") {
    body = `Hi ${recipient},

I've been tracking ${company}'s latest updates and see a clear opportunity for you to fast-track your progress on ${goal}.

With my background as ${bg}, I've helped similar initiatives scale efficiently, and I'm confident we can drive comparable results for ${company}. I have 2-3 specific strategies in mind that could directly impact your current trajectory.

Let's set up a brief call this Thursday at 2 PM to explore this. Does that work for you?

Cheers,

[Your Name]`;
  } else if (tone === "casual") {
    body = `Hey ${recipient},

Hope your week is going well. 

I'm reaching out because I'm super interested in what ${company} is building, particularly around ${goal}. I've spent quite a bit of time working with ${bg}, and it got me thinking about a few creative ways to collaborate.

Do you have 5 minutes for a quick catch-up sometime soon? No hard pitch, just wanted to share some thoughts.

Talk soon,

[Your Name]`;
  } else {
    // Professional (default)
    body = `Dear ${recipient},

I hope this email finds you well.

I am reaching out to you because I have been following ${company}'s progress in the industry with great interest, particularly regarding your current focus on ${goal}. 

Given my background in ${bg}, I believe there is a strong alignment between our objectives. I would welcome the opportunity to discuss how we might collaborate to support ${company}'s strategic initiatives.

Could we schedule a brief 10-minute introductory call next week? Please let me know your availability.

Sincerely,

[Your Name]`;
  }

  return `Subject: ${subject}\n\n${body}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipientName, companyName, purpose, tone, background } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    const isMockMode = !apiKey || apiKey === "your_openai_key" || apiKey.trim() === "";

    if (isMockMode) {
      console.log("⚠️ OpenAI API Key is missing or set to placeholder. Operating in DEVELOPER MOCK MODE.");
      // Simulate network latency of 1.2 seconds for realistic UI feel
      await delay(1200);
      const email = generateMockEmail(recipientName, companyName, purpose, tone, background);
      return Response.json({
        success: true,
        email,
        isMock: true
      });
    }

    // Live OpenAI mode
    const openai = new OpenAI({ apiKey });
    
    const prompt = `
You are an expert cold outreach email writer.

Write a concise outreach email using these details:
- Recipient Name: ${recipientName || "Name not specified (use appropriate general greeting)"}
- Company Name: ${companyName || "Company not specified"}
- Purpose of Email: ${purpose || "Outreach"}
- Tone: ${tone || "Professional"}
- Sender's Background: ${background || "Not specified"}

Rules:
- Keep the entire output (including Subject line and Body) under 180 words.
- Start with "Subject: [Compelling Subject Line]" on the first line.
- Leave a double blank line, then write the email body.
- Sound human, personal, and authentic. Avoid corporate buzzwords or generic templates.
- End with a single clear Call to Action (CTA).
- Do not add any placeholder tags like "[Date]" or explanatory notes. Use "[Your Name]" for the signature.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Corrected model from gpt-4.1-mini
      messages: [
        {
          role: "system",
          content: "You are a professional outreach email assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const email = completion.choices[0]?.message?.content || "Failed to generate email content.";

    return Response.json({
      success: true,
      email,
      isMock: false
    });
  } catch (error: any) {
    console.error("API Route Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Something went wrong while generating the email.",
      },
      {
        status: 500,
      }
    );
  }
}
