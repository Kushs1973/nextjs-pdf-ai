"use client";
import React, { useState } from 'react';
import { Upload, FileText, Zap, AlertCircle } from 'lucide-react';

export default function Analyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a document first.");
      return;
    }

    setLoading(true);
    setAnalysis('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        // --- THE FIX: REMOVE THE MARKDOWN TAGS ---
        // This deletes "```html" and "```" from the AI's answer
        let cleanResult = data.result
          .replace(/```html/g, "")
          .replace(/```/g, "");
          
        setAnalysis(cleanResult);
      } else {
        const text = await response.text();
        throw new Error("Server Error: " + text.slice(0, 100));
      }

    } catch (err) {
      console.error(err);
      alert("Analysis Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
            <h1 style={styles.title}>📄 PDFly Analyst</h1>
            <p style={styles.subtitle}>Upload your document below.</p>
        </div>
        
        <div style={styles.uploadBox}>
          <input 
            type="file" 
            accept=".pdf, .png, .jpg, .jpeg"
            style={styles.hiddenInput}
            id="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="fileInput" style={styles.uploadLabel}>
            <Upload size={40} color="#666" style={{marginBottom: '10px'}}/>
            <p style={{margin: 0, fontWeight: '500'}}>
              {file ? file.name : "Click to Upload PDF or Image"}
            </p>
          </label>
        </div>

        <button 
          onClick={handleAnalyze} 
          style={loading ? styles.buttonDisabled : styles.button}
          disabled={loading}
        >
          {loading ? (
             <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
               <Zap size={18} className="animate-pulse"/> Analyzing...
             </div>
          ) : "Start Analysis"}
        </button>

        {analysis && (
          <div style={styles.resultArea}>
            <div style={styles.resultHeader}>
                <FileText size={18} color="#fff"/> Analysis Result
            </div>
            <div dangerouslySetInnerHTML={{ __html: analysis }} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#121212', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' },
  card: { width: '100%', maxWidth: '700px', backgroundColor: '#1F1F1F', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: '15px' },
  
  uploadBox: { marginBottom: '30px', position: 'relative' },
  hiddenInput: { display: 'none' },
  uploadLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', border: '2px dashed #444', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: 'rgba(255,255,255,0.02)', color: '#aaa' },
  
  button: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px', transition: '0.2s' },
  buttonDisabled: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#444', color: '#888', cursor: 'not-allowed', marginTop: '10px' },
  
  resultArea: { marginTop: '40px', padding: '30px', backgroundColor: '#000', borderRadius: '16px', border: '1px solid #333', lineHeight: '1.7', color: '#e0e0e0' },
  resultHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', borderBottom: '1px solid #333', paddingBottom: '15px' }
};
