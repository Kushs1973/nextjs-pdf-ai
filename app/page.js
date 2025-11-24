"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Zap, FileText, Star, User } from 'lucide-react';
import { Orbitron, Outfit } from 'next/font/google';

// 1. LOAD FONTS
// If you want specific fonts later, just tell me their names!
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });
const outfit = Outfit({ subsets: ['latin'], weight: ['300', '500', '700'] });

export default function LandingPage() {
  
  // --- FONT CHANGING EFFECT ---
  const [currentFont, setCurrentFont] = useState(orbitron.style.fontFamily);

  useEffect(() => {
    const fonts = [
      orbitron.style.fontFamily,    // Sci-Fi
      '"Courier New", monospace',   // Code
      '"Times New Roman", serif',   // Classic
      'Impact, sans-serif',         // Heavy
      '"Arial Black", sans-serif'   // Bold
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % fonts.length;
      setCurrentFont(fonts[index]);
    }, 400); // Speed of glitch (400ms)

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container} className={outfit.className}>
      
      {/* --- HERO SECTION (Minimalist) --- */}
      <section style={styles.heroSection}>
        <div style={styles.glowBg}></div>
        
        {/* Floating animation removed. Now it stays still. */}
        <div>
          <h1 style={{...styles.glitchTitle, fontFamily: currentFont}}>
            PDFly
          </h1>
        </div>
        
        {/* Subtitle and Scroll Text removed as requested */}
      </section>


      {/* --- HOW IT WORKS --- */}
      <section style={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={styles.contentWrapper}
        >
          <h2 style={styles.sectionHeader}>How It Works</h2>
          
          <div style={styles.grid}>
            {/* Step 1 */}
            <div style={styles.stepCard}>
              <div style={styles.stepIcon}><Upload size={24} color="#fff"/></div>
              <h3 style={styles.stepTitle}>1. Upload</h3>
              <p style={styles.stepDesc}>Drag & drop any PDF or Image file into the secure vault.</p>
            </div>

            {/* Step 2 */}
            <div style={styles.stepCard}>
              <div style={styles.stepIcon}><Zap size={24} color="#fff"/></div>
              <h3 style={styles.stepTitle}>2. Analyze</h3>
              <p style={styles.stepDesc}>Our AI scans every pixel and letter instantly.</p>
            </div>

            {/* Step 3 */}
            <div style={styles.stepCard}>
              <div style={styles.stepIcon}><FileText size={24} color="#fff"/></div>
              <h3 style={styles.stepTitle}>3. Insight</h3>
              <p style={styles.stepDesc}>Get structured summaries and executive briefs.</p>
            </div>
          </div>
        </motion.div>
      </section>


      {/* --- SOCIAL PROOF --- */}
      <section style={{...styles.section, backgroundColor: '#050505'}}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{...styles.sectionHeader, marginBottom: '60px'}}>Trusted by Analysts</h2>
          
          <div style={styles.sliderContainer}>
            <div style={styles.sliderTrack}>
              {[...reviews, ...reviews, ...reviews].map((review, index) => (
                <div key={index} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.avatar}><User size={14} color="#fff"/></div>
                    <div>
                      <div style={styles.reviewName}>{review.name}</div>
                      <div style={styles.stars}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="#fff" color="none"/>)}
                      </div>
                    </div>
                  </div>
                  <p style={styles.reviewText}>"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>


      {/* --- FINAL CTA --- */}
      <section style={styles.ctaSection}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{textAlign: 'center'}}
        >
          <h2 style={styles.ctaHeadline}>Ready to simplify?</h2>
          <Link href="/analyzer">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
              whileTap={{ scale: 0.95 }}
              style={styles.finalButton}
            >
              Launch PDFly <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        body { margin: 0; background-color: #000; }
      `}</style>
    </div>
  );
}

// DATA
const reviews = [
  { name: "Alex D.", text: "Dark mode perfection. Fast and accurate." },
  { name: "Sarah J.", text: "Finally an AI reader that handles images!" },
  { name: "Mike T.", text: "The structured summaries are a lifesaver." },
  { name: "Priya K.", text: "Cleanest UI I have ever seen." },
];

// STYLES
const styles = {
  container: { backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', overflowX: 'hidden' },
  
  // HERO (Cleaned up)
  heroSection: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  
  // Glitch Title Style
  glitchTitle: { fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: '900', letterSpacing: '5px', color: '#fff', textShadow: '0 0 50px rgba(255,255,255,0.2)', transition: 'font-family 0.2s ease', textAlign: 'center' },
  
  glowBg: { position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)', zIndex: -1 },

  // SECTIONS
  section: { minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 20px' },
  contentWrapper: { maxWidth: '1000px', margin: '0 auto', width: '100%' },
  sectionHeader: { fontSize: '3rem', textAlign: 'center', marginBottom: '80px', fontWeight: 'bold' },
  
  // GRID
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' },
  stepCard: { padding: '40px', border: '1px solid #222', borderRadius: '20px', backgroundColor: '#0a0a0a', transition: 'border-color 0.3s' },
  stepIcon: { marginBottom: '20px', opacity: 0.8 },
  stepTitle: { fontSize: '1.5rem', marginBottom: '10px' },
  stepDesc: { color: '#888', lineHeight: '1.6' },

  // SLIDER
  sliderContainer: { width: '100%', overflow: 'hidden' },
  sliderTrack: { display: 'flex', gap: '20px', width: 'max-content', animation: 'scroll 40s linear infinite' },
  reviewCard: { width: '300px', padding: '25px', backgroundColor: '#111', borderRadius: '15px', border: '1px solid #222', flexShrink: 0 },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  reviewName: { fontSize: '14px', fontWeight: 'bold' },
  stars: { display: 'flex', gap: '2px', marginTop: '2px' },
  reviewText: { color: '#aaa', fontStyle: 'italic', fontSize: '15px' },

  // CTA
  ctaSection: { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  ctaHeadline: { fontSize: '3rem', marginBottom: '40px' },
  finalButton: { padding: '20px 50px', fontSize: '1.2rem', backgroundColor: '#000', color: '#fff', border: '1px solid #fff', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' },
};
