import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. FIX: Manually create a 'require' tool for the old-school library
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const apiKey = formData.get('apiKey');

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // 2. Read the PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfData = await pdf(buffer);
    const pdfText = pdfData.text.slice(0, 15000);

    // 3. AI Analysis
    const client = new OpenAI({ apiKey: apiKey });

    const prompt = `
    Analyze this PDF text. Output strictly in HTML (using <h3>, <ul>, <li>, <p>).
    - Executive Summary
    - Key Points
    - Actionable Insights

    TEXT: ${pdfText}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", "content": "You are a helpful analyst." },
        { role: "user", "content": prompt },
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
