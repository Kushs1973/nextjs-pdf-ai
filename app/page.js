"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Zap, FileText, Star, User } from 'lucide-react';
import { 
  Outfit, 
  Roboto_Slab, 
  Oswald, 
  Zilla_Slab, 
  DM_Sans, 
  Fredoka, 
  Montserrat 
} from 'next/font/google';

// 1. LOAD THE FONT LOOKALIKES
const outfit = Outfit({ subsets: ['latin'], weight: ['300', '500', '700'] });
const inputSerifLike = Roboto_Slab({ subsets: ['latin'], weight: ['400', '700'] });
const minettoLike = Oswald({ subsets: ['latin'], weight: ['500'] });
const mortiseLike = Zilla_Slab({ subsets: ['latin'], weight: ['700'] });
const sonarLike = DM_Sans({ subsets: ['latin'], weight: ['700'] });
const mokokoLike = Fredoka({ subsets: ['latin'], weight: ['600'] });
const avenirLike = Montserrat({ subsets: ['latin'], weight: ['800'] });

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.95 },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LandingPage() {
  
  // --- FONT CHANGING EFFECT ---
  const [currentFont, setCurrentFont] = useState(avenirLike.style.fontFamily);

  useEffect(() => {
    const fonts = [
      inputSerifLike.style.fontFamily,
      minettoLike.style.fontFamily,
      mortiseLike.style.fontFamily,
      sonarLike.style.fontFamily,
      mokokoLike.style.fontFamily,
      avenirLike.style.fontFamily
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % fonts.length;
      setCurrentFont(fonts[index]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    // OUTER WRAPPER (Pure Black Background)
    <div style={styles.outerWrapper} className={outfit.className}>
      
      {/* INNER FRAME (The Translucent Rounded Screen) */}
      <div style={styles.glassFrame}>
        
        {/* --- HERO SECTION --- */}
        <section style={styles.heroSection}>
          <div style={styles.glowBg}></div>
          
          {/* Fades in from Top */}
          <motion.div
            initial={{ opacity: 0, y: -100 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* TEXT ONLY - No Border here anymore */}
            <h1 style={{...styles.glitchTitle, fontFamily: currentFont}}>
              PDFly
            </h1>
          </motion.div>
        </section>


        {/* --- HOW IT WORKS --- */}
        <section style={styles.section}>
          <div style={styles.contentWrapper}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={styles.sectionHeader}
            >
              How It Works
            </motion.h2>
            
            <motion.div 
              style={styles.grid}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div style={styles.stepCard} variants={cardVariants}>
                <div style={styles.stepIcon}><Upload size={24} color="#fff"/></div>
                <h3 style={styles.stepTitle}>1. Upload</h3>
                <p style={styles.stepDesc}>Drag & drop any PDF or Image file into the secure vault.</p>
              </motion.div>

              <motion.div style={styles.stepCard} variants={cardVariants}>
                <div style={styles.stepIcon}><Zap size={24} color="#fff"/></div>
                <h3 style={styles.stepTitle}>2. Analyze</h3>
                <p style={styles.stepDesc}>Our AI scans every pixel and letter instantly.</p>
              </motion.div>

              <motion.div style={styles.stepCard} variants={cardVariants}>
                <div style={styles.stepIcon}><FileText size={24} color="#fff"/></div>
                <h3 style={styles.stepTitle}>3. Insight</h3>
                <p style={styles.stepDesc}>Get structured summaries and executive briefs.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>


        {/* --- SOCIAL PROOF --- */}
        <section style={{...styles.section, backgroundColor: 'rgba(0,0,0,0.3)'}}>
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
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        body { margin: 0; background-color: #000; overflow-x: hidden; }
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
  // 1. OUTER WRAPPER: The "Desk" behind the screen
  outerWrapper: {
    backgroundColor: '#000000',
    minHeight: '100vh',
    width: '100vw',
    padding: '20px', // This creates the gap around the edges
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },

  // 2. GLASS FRAME: The actual "Website"
  glassFrame: {
    width: '100%',
    maxWidth: '1600px', // Prevents it from getting too wide on huge screens
    backgroundColor: 'rgba(20, 20, 20, 0.8)', // Translucent Dark Grey
    borderRadius: '30px', // The Rounded Corners of the screen
    border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
    backdropFilter: 'blur(20px)', // The Blur Effect
    overflow: 'hidden', // Keeps content inside the round corners
    position: 'relative',
    boxShadow: '0 0 50px rgba(0,0,0,0.5)',
  },
  
  // HERO
  heroSection: { height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  
  glitchTitle: { fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: '900', letterSpacing: '5px', color: '#fff', textShadow: '0 0 50px rgba(255,255,255,0.2)', transition: 'font-family 0.2s ease', textAlign: 'center', margin: 0 },
  
  glowBg: { position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)', zIndex: -1 },

  // SECTIONS
  section: { minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 40px' },
  contentWrapper: { maxWidth: '1000px', margin: '0 auto', width: '100%' },
  sectionHeader: { fontSize: '3rem', textAlign: 'center', marginBottom: '80px', fontWeight: 'bold' },
  
  // GRID
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' },
  stepCard: { padding: '40px', border: '1px solid #333', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.02)', transition: 'border-color 0.3s' },
  stepIcon: { marginBottom: '20px', opacity: 0.8 },
  stepTitle: { fontSize: '1.5rem', marginBottom: '10px' },
  stepDesc: { color: '#888', lineHeight: '1.6' },

  // SLIDER
  sliderContainer: { width: '100%', overflow: 'hidden' },
  sliderTrack: { display: 'flex', gap: '20px', width: 'max-content', animation: 'scroll 40s linear infinite' },
  reviewCard: { width: '300px', padding: '25px', backgroundColor: '#111', borderRadius: '15px', border: '1px solid #333', flexShrink: 0 },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  reviewName: { fontSize: '14px', fontWeight: 'bold' },
  stars: { display: 'flex', gap: '2px', marginTop: '2px' },
  reviewText: { color: '#aaa', fontStyle: 'italic', fontSize: '15px' },

  // CTA
  ctaSection: { height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  ctaHeadline: { fontSize: '3rem', marginBottom: '40px' },
  finalButton: { padding: '20px 50px', fontSize: '1.2rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' },
};
