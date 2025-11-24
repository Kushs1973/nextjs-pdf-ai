import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const apiKey = process.env.OPENAI_API_KEY; 

    if (!apiKey) return NextResponse.json({ error: "Server Error: API Key missing." }, { status: 500 });
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const client = new OpenAI({ apiKey: apiKey });
    let promptContent = "";
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith('image/');

    if (isImage) {
        // --- IMAGE PATH (Vision AI) ---
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

        // --- THE SMARTER CHECK ---
        // 1. We count ONLY real letters (a-z) and numbers (0-9).
        // 2. We ignore "----", spaces, newlines, and "Page Break" markers.
        const alphanumericCount = (pdfText.match(/[a-zA-Z0-9]/g) || []).length;

        // If there are fewer than 50 REAL letters, it's definitely a scan.
        if (alphanumericCount < 50) {
             return NextResponse.json({ 
                result: `
                <h3>⚠️ Image-PDF Detected</h3>
                <p><b>We found 0 readable text in this PDF.</b></p>
                <p>It looks like this document is a scanned photo (like an ID card or receipt) saved as a PDF. Our text reader cannot see the pixels.</p>
                <br/>
                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border: 1px solid #444;">
                  <p style="margin:0; font-weight:bold; color: #fff;">✅ How to fix:</p>
                  <ul style="margin-top:10px; margin-bottom:0; color: #ccc;">
                    <li>Take a <b>Screenshot</b> of this PDF.</li>
                    <li>Upload the screenshot (<b>.JPG</b> or <b>.PNG</b>) directly.</li>
                  </ul>
                </div>
                <p style="margin-top:15px; font-size: 0.9em; color: #888;">
                  Switching to Image Upload activates our <b>AI Vision</b> engine, which can read passports, Aadhar cards, and handwritten notes perfectly.
                </p>
                ` 
            });
        }
        
        // Clean text for AI
        let cleanText = pdfText.replace(/[^\x20-\x7E\n]/g, '');
        
        promptContent = `
        Analyze this PDF text. Output strictly in HTML (using <h3>, <ul>, <li>, <p>).
        - Executive Summary
        - Key Points
        - Actionable Insights
        TEXT: ${cleanText.slice(0, 30000)} 
        `;
    }

    // 3. Send to OpenAI
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
