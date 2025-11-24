import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

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
        // Use 'null' context to avoid 'this' issues
        const pdfParser = new PDFParser(null, 1);
        
        const parsedText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
            
            // --- THE FIX: MANUAL EXTRACTION ---
            // We do not use .getRawTextContent(). We parse the JSON structure ourselves.
            pdfParser.on("pdfParser_dataReady", (pdfData) => {
                try {
                    // Loop through Pages -> Texts -> R (Runs) -> T (Text)
                    // The text is URI-encoded, so we decode it.
                    const text = pdfData.Pages.reduce((pageAcc, page) => {
                        return pageAcc + page.Texts.reduce((textAcc, textItem) => {
                            return textAcc + decodeURIComponent(textItem.R[0].T) + " ";
                        }, " ") + "\n";
                    }, "");
                    
                    resolve(text);
                } catch (e) {
                    console.error("Manual Parse Error:", e);
                    resolve(""); // If structure is weird, return empty so we trigger the image warning
                }
            });
            
            pdfParser.parseBuffer(buffer);
        });

        // Clean text
        let cleanText = parsedText.replace(/[^\x20-\x7E\n]/g, '');

        // --- THE SMART CHECK ---
        const alphanumericCount = (cleanText.match(/[a-zA-Z0-9]/g) || []).length;

        if (alphanumericCount < 50) {
             return NextResponse.json({ 
                result: `
                <h3>⚠️ Image-PDF Detected</h3>
                <p><b>We found 0 readable text in this PDF.</b></p>
                <p>It looks like this document is a scanned photo saved as a PDF.</p>
                <br/>
                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border: 1px solid #444;">
                  <p style="margin:0; font-weight:bold; color: #fff;">✅ How to fix:</p>
                  <ul style="margin-top:10px; margin-bottom:0; color: #ccc;">
                    <li>Take a <b>Screenshot</b> of this PDF.</li>
                    <li>Upload the screenshot (<b>.JPG</b> or <b>.PNG</b>).</li>
                  </ul>
                </div>
                ` 
            });
        }
        
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
