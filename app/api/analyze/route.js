import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. Import the PDF Tool using the "Require" trick for stability
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    // Get API Key from Server Settings
    const apiKey = process.env.OPENAI_API_KEY; 

    if (!apiKey) return NextResponse.json({ error: "Server Error: API Key missing." }, { status: 500 });
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const client = new OpenAI({ apiKey: apiKey });
    let promptContent = "";
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith('image/');

    if (isImage) {
        // --- IMAGE PATH (Vision AI) ---
        // If user uploads a JPG/PNG, we use GPT-5's eyes.
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64Image}`;
        
        promptContent = [
            { type: "text", text: "Analyze this image document. Extract information and structure it nicely." },
            { type: "image_url", image_url: { url: dataUrl } }
        ];

    } else {
        // --- PDF PATH (Text AI) ---
        let pdfText = "";
        try {
            const data = await pdf(buffer);
            pdfText = data.text;
        } catch (e) {
            console.error("PDF Parse Error:", e);
            pdfText = ""; 
        }

        // --- THE SMART CHECK ---
        // If the PDF has less than 50 letters, it is almost certainly a photo scan.
        if (!pdfText || pdfText.trim().length < 50) {
             return NextResponse.json({ 
                result: `
                <h3>⚠️ Image-PDF Detected</h3>
                <p>The AI found <b>no text</b> in this PDF. This usually means it is a <b>scanned photo</b> saved as a PDF.</p>
                <br/>
                <div style="background: #222; padding: 15px; border-radius: 8px; border: 1px solid #444;">
                  <p style="margin:0; font-weight:bold;">✅ How to fix:</p>
                  <ul style="margin-top:10px; margin-bottom:0;">
                    <li>Take a <b>Screenshot</b> of this document.</li>
                    <li>Upload the screenshot (<b>.JPG</b> or <b>.PNG</b>) instead.</li>
                  </ul>
                </div>
                <p style="margin-top:15px; font-size: 0.9em; color: #888;">Because you uploaded a PDF, we tried to read the text code. If you upload an Image, we will use the AI's Vision Eyes.</p>
                ` 
            });
        }
        
        // If text exists, clean it up and prepare it for AI
        let cleanText = pdfText.replace(/[^\x20-\x7E\n]/g, ''); // Remove weird symbols
        
        promptContent = `
        Analyze this PDF text. Output strictly in HTML (using <h3>, <ul>, <li>, <p>).
        - Executive Summary
        - Key Points
        - Actionable Insights
        TEXT: ${cleanText.slice(0, 25000)} 
        `;
    }

    // 3. Send to OpenAI (Using the new GPT-5-mini)
    const completion = await client.chat.completions.create({
      model: "gpt-5-mini", 
      messages: [
        { role: "system", "content": "You are a helpful analyst. Output results in HTML." },
        { role: "user", "content": promptContent },
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
