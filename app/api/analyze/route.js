import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const apiKey = formData.get('apiKey');

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // 1. Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse PDF
    const pdfParser = new PDFParser(this, 1);

    const parsedText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    // 3. FIX: Safe Text Cleaning
    // Sometimes the text comes back weirdly formatted. We try to clean it,
    // but if that fails, we just use the raw text instead of crashing.
    let cleanText;
    try {
        cleanText = decodeURIComponent(parsedText);
    } catch (e) {
        cleanText = parsedText; // Fallback to raw text if decoding fails
    }
    
    // Limit text length to avoid OpenAI limits
    const finalText = cleanText.slice(0, 20000);

    // 4. Send to OpenAI
    const client = new OpenAI({ apiKey: apiKey });
    
    const prompt = `
    Analyze this PDF text. Output strictly in HTML (using <h3>, <ul>, <li>, <p>).
    - Executive Summary
    - Key Points
    - Actionable Insights
    
    TEXT: ${finalText}
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
