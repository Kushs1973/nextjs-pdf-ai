import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// FIX: We use 'require' here because 'pdf-parse' is an older library
// that doesn't support the 'import' statement perfectly in this environment.
const pdf = require('pdf-parse');

export async function POST(req) {
  try {
    // 1. Prepare the incoming file
    const formData = await req.formData();
    const file = formData.get('file');
    const apiKey = formData.get('apiKey');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Read the PDF text
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use the library to extract text
    const pdfData = await pdf(buffer);
    const pdfText = pdfData.text.slice(0, 15000); // Limit text to save costs

    // 3. Send to OpenAI
    const client = new OpenAI({ apiKey: apiKey });
    
    const prompt = `
    Analyze this text from a PDF. Provide a response in HTML format (using <h3>, <ul>, <li>, <p> tags only) suitable for a dark theme website.
    Structure:
    - Executive Summary
    - Key Points (bullet points)
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

    // 4. Return the answer
    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
