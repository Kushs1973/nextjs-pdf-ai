import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const apiKey = formData.get('apiKey');

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const client = new OpenAI({ apiKey: apiKey });
    let promptContent = "";
    
    // Check if the file is an Image or a PDF
    const isImage = file.type.startsWith('image/');
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isImage) {
        // --- IMAGE HANDLING (Vision) ---
        // Convert the image to a base64 string so OpenAI can "see" it
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64Image}`;
        
        promptContent = [
            { type: "text", text: "Analyze this image document. Extract the information and structure it nicely." },
            { type: "image_url", image_url: { url: dataUrl } }
        ];

    } else {
        // --- PDF HANDLING (Text) ---
        const pdfParser = new PDFParser(this, 1);
        const parsedText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData.getRawTextContent()));
            pdfParser.parseBuffer(buffer);
        });

        // Clean text
        let cleanText;
        try { cleanText = decodeURIComponent(parsedText); } 
        catch (e) { cleanText = parsedText; }

        if (!cleanText || cleanText.trim().length < 20) {
             return NextResponse.json({ 
                result: `
                <h3>⚠️ Scan Detected</h3>
                <p>This PDF is an image scan. On this simplified version of the app, we cannot read image-PDFs.</p>
                <p><b>Quick Fix:</b> Please upload the original <b>JPG/PNG image</b> file directly!</p>
                ` 
            });
        }
        
        promptContent = `
        Analyze this PDF text. Output strictly in HTML (using <h3>, <ul>, <li>, <p>).
        - Executive Summary
        - Key Points
        - Actionable Insights
        TEXT: ${cleanText.slice(0, 20000)}
        `;
    }

    // Send to OpenAI (Vision or Text)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // GPT-4o-mini has vision capabilities built-in!
      messages: [
        { role: "system", "content": "You are a helpful analyst. Output results in HTML structure." },
        { role: "user", "content": promptContent },
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
