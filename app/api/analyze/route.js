import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const apiKey = process.env.OPENAI_API_KEY; 

    // 1. Basic Checks
    if (!apiKey) {
      return NextResponse.json({ error: "Server Configuration Error: API Key missing." }, { status: 500 });
    }
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: apiKey });
    let promptContent = "";
    
    // 2. Prepare File
    const buffer = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith('image/');

    if (isImage) {
        // --- IMAGE HANDLING (Vision) ---
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64Image}`;
        
        promptContent = [
            { type: "text", text: "Analyze this image document. Extract information and structure it nicely." },
            { type: "image_url", image_url: { url: dataUrl } }
        ];

    } else {
        // --- PDF HANDLING (Text) ---
        const pdfParser = new PDFParser(this, 1);
        
        const parsedText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
            pdfParser.parseBuffer(buffer);
        });

        let cleanText;
        try { cleanText = decodeURIComponent(parsedText); } 
        catch (e) { cleanText = parsedText; }

        if (!cleanText || cleanText.trim().length < 20) {
             return NextResponse.json({ 
                result: `
                <h3>⚠️ Scan Detected</h3>
                <p>This PDF appears to be an image scan. Please upload the <b>Image file (JPG/PNG)</b> directly for best results!</p>
                ` 
            });
        }
        
        promptContent = `
        Analyze this PDF text. Output strictly in HTML (using <h3>, <ul>, <li>, <p>).
        - Executive Summary
        - Key Points
        - Actionable Insights
        TEXT: ${cleanText.slice(0, 25000)} 
        `;
    }

    // 3. Send to OpenAI (THE GPT-5 UPGRADE)
    const completion = await client.chat.completions.create({
      model: "gpt-5-mini", // <--- THE NEWEST ENGINE
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
