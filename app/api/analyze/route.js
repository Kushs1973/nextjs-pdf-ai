import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const apiKey = formData.get('apiKey');

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // 1. Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse PDF using pdf2json (The Modern Way)
    const pdfParser = new PDFParser(this, 1); // 1 means "Text Only"

    // We wrap this in a Promise because pdf2json uses "Events" (old style callbacks)
    const parsedText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        // Extract raw text content
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    // 3. Send to OpenAI
    const client = new OpenAI({ apiKey: apiKey });
    
    // Clean up text slightly before sending (decode URL format)
    const cleanText = decodeURIComponent(parsedText).slice(0, 20000);

    const prompt = `
    Analyze this PDF text. Output strictly in HTML (using <h3>, <ul>, <li>, <p>).
    - Executive Summary
    - Key Points
    - Actionable Insights
    
    TEXT: ${cleanText}
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
