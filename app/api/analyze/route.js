import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    // --- SECURITY UPGRADE ---
    // Instead of getting the key from the user, we get it from the Server Vault
    const apiKey = process.env.OPENAI_API_KEY; 

    if (!apiKey) {
      return NextResponse.json({ error: "Server Configuration Error: API Key missing." }, { status: 500 });
    }

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const client = new OpenAI({ apiKey: apiKey });
    let promptContent = "";
    
    // Check if the file is an Image or a PDF
    const isImage = file.type.startsWith('image/');
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isImage) {
        // --- IMAGE HANDLING ---
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64Image}`;
        
        promptContent = [
            { type: "text", text: "Analyze this image document. Extract information and structure it nicely." },
            { type: "image_url", image_url: { url: dataUrl } }
        ];

    } else {
        // --- PDF HANDLING ---
        const pdfParser = new PDFParser(this, 1);
        const parsedText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", (pdfData) => resolve(pdfData.getRawTextContent()));
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
        TEXT: ${cleanText.slice(0, 20000)}
        `;
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
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
