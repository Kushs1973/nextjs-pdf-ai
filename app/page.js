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

// 1. LOAD FONTS
const outfit = Outfit({ subsets: ['latin'], weight: ['300', '500', '700'] });
const inputSerifLike = Roboto_Slab({ subsets: ['latin'], weight: ['400', '700'] });
const minettoLike = Oswald({ subsets: ['latin'], weight: ['500'] });
const mortiseLike = Zilla_Slab({ subsets: ['latin'], weight: ['700'] });
const sonarLike = DM_Sans({ subsets: ['latin'], weight: ['700'] });
const mokokoLike = Fredoka({ subsets: ['latin'], weight: ['600'] });
const avenirLike = Montserrat({ subsets: ['latin'], weight: ['800'] });

// --- THE APPLE ANIMATION SETTINGS ---
const revealVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,              // Start 50px lower
    filter: 'blur(10px)', // Start blurry
    scale: 0.98         // Start slightly smaller
  },
  visible: { 
    opacity: 1, 
    y: 0,               // Move to final position
    filter: 'blur(0px)',  // Become clear
    scale: 1,           // Scale to normal
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] // The "Apple" Easing Curve
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

export default function LandingPage() {
  
  // --- FONT EFFECT ---
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
    <div style={styles.container} className={outfit.className}>
      
      {/* --- BLOCK 1: HERO (PDFly) --- */}
      <motion.section 
        style={{...styles.sectionBlock, minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={revealVariants} // <--- Apply Apple Animation
      >
        <div style={styles.glowBg}></div>
        
        <div>
          <h1 style={{...styles.glitchTitle, fontFamily: currentFont}}>
            PDFly
          </h1>
        </div>
      </motion.section>


      {/* --- BLOCK 2: HOW IT WORKS --- */}
      <motion.section 
        style={styles.sectionBlock}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants} // <--- Apply Apple Animation
      >
        <div style={styles.contentWrapper}>
          <h2 style={styles.sectionHeader}>How It Works</h2>
          
          <motion.div 
            style={styles.grid}
            variants={staggerContainer} // Stagger the cards inside
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div style={styles.stepCard} variants={revealVariants}>
              <div style={styles.stepIcon}><Upload size={24} color="#fff"/></div>
              <h3 style={styles.stepTitle}>1. Upload</h3>
              <p style={styles.stepDesc}>Drag & drop any PDF or Image file into the secure vault.</p>
            </motion.div>

            <motion.div style={styles.stepCard} variants={revealVariants}>
              <div style={styles.stepIcon}><Zap size={24} color="#fff"/></div>
              <h3 style={styles.stepTitle}>2. Analyze</h3>
              <p style={styles.stepDesc}>Our AI scans every pixel and letter instantly.</p>
            </motion.div>

            <motion.div style={styles.stepCard} variants={revealVariants}>
              <div style={styles.stepIcon}><FileText size={24} color="#fff"/></div>
              <h3 style={styles.stepTitle}>3. Insight</h3>
              <p style={styles.stepDesc}>Get structured summaries and executive briefs.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      {/* --- BLOCK 3: SOCIAL PROOF --- */}
      <motion.section 
        style={styles.sectionBlock}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={revealVariants} // <--- Apply Apple Animation
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
      </motion.section>


      {/* --- BLOCK 4: CTA --- */}
      <motion.section 
        style={{...styles.sectionBlock, minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={revealVariants} // <--- Apply Apple Animation
      >
        <div style={{textAlign: 'center'}}>
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
        </div>
      </motion.section>

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
  container: {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '20px', // Outer gap
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // GAP BETWEEN THE RECTANGLES
  },

  // --- THE SEPARATE RECTANGLES STYLE ---
  sectionBlock: {
    backgroundColor: '#080808', // Very dark grey
    borderRadius: '30px',       // Rounded corners
    border: '1px solid #222',   // Subtle border
    padding: '60px 20px',       // Breathing room inside the rectangle
    position: 'relative',
    overflow: 'hidden',
  },

  // HERO STYLES
  glitchTitle: { fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: '900', letterSpacing: '5px', color: '#fff', textShadow: '0 0 50px rgba(255,255,255,0.2)', transition: 'font-family 0.2s ease', textAlign: 'center', margin: 0 },
  glowBg: { position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)', zIndex: -1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },

  // COMMON SECTION STYLES
  contentWrapper: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
  sectionHeader: { fontSize: '3rem', textAlign: 'center', marginBottom: '80px', fontWeight: 'bold', color: '#fff' },

  // GRID
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
  stepCard: { padding: '40px', border: '1px solid #333', borderRadius: '20px', backgroundColor: '#000', transition: 'border-color 0.3s' },
  stepIcon: { marginBottom: '20px', opacity: 0.9 },
  stepTitle: { fontSize: '1.5rem', marginBottom: '10px', color: '#fff' },
  stepDesc: { color: '#ddd', lineHeight: '1.6', fontSize: '1.1rem' },

  // SLIDER
  sliderContainer: { width: '100%', overflow: 'hidden' },
  sliderTrack: { display: 'flex', gap: '20px', width: 'max-content', animation: 'scroll 40s linear infinite' },
  reviewCard: { width: '300px', padding: '25px', backgroundColor: '#000', borderRadius: '15px', border: '1px solid #333', flexShrink: 0 },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  reviewName: { fontSize: '14px', fontWeight: 'bold', color: '#fff' },
  stars: { display: 'flex', gap: '2px', marginTop: '2px' },
  reviewText: { color: '#ccc', fontStyle: 'italic', fontSize: '15px' },

  // CTA
  ctaHeadline: { fontSize: '3rem', marginBottom: '40px', color: '#fff' },
  finalButton: { padding: '20px 50px', fontSize: '1.2rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' },
};
