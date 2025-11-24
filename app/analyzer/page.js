"use client";
import React, { useState } from 'react';

export default function Analyzer() {
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!apiKey || !file) {
      alert("Please provide both an API Key and a document.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apiKey', apiKey);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setAnalysis(data.result);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📄 AI Analyst</h1>
        <p style={styles.subtitle}>Supports: PDF • JPG • PNG</p>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>OpenAI API Key</label>
          <input 
            type="password" 
            placeholder="sk-..." 
            style={styles.input}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Upload Document</label>
          {/* UPDATED: Now accepts Images too! */}
          <input 
            type="file" 
            accept=".pdf, .png, .jpg, .jpeg"
            style={styles.fileInput}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button 
          onClick={handleAnalyze} 
          style={loading ? styles.buttonDisabled : styles.button}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Start Analysis"}
        </button>

        {analysis && (
          <div style={styles.resultArea}>
            <div dangerouslySetInnerHTML={{ __html: analysis }} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' },
  card: { width: '100%', maxWidth: '600px', backgroundColor: '#171717', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', border: '1px solid #333' },
  title: { fontSize: '24px', marginBottom: '10px', textAlign: 'center' },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: '30px', fontSize: '14px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#262626', color: '#fff', fontSize: '14px', outline: 'none' },
  fileInput: { color: '#fff', fontSize: '14px' },
  button: { width: '100%', padding: '14px', borderRadius: '6px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: '0.2s' },
  buttonDisabled: { width: '100%', padding: '14px', borderRadius: '6px', border: 'none', backgroundColor: '#444', color: '#888', cursor: 'not-allowed', marginTop: '10px' },
  resultArea: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #333', lineHeight: '1.6', color: '#ddd' }
};
