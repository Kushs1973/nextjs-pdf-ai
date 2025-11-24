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

// --- ANIMATION VARIANTS (RESTORED) ---
const revealVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.98 },
  visible: { 
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
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
      
      {/* --- BACKGROUND GRID --- */}
      <div style={styles.gridBackground}></div>

      {/* --- SECTION 1: HERO --- */}
      {/* Animation: Immediate Drop-in (ignoring scroll) */}
      <section style={styles.sectionBlock}>
        <motion.div
          initial={{ opacity: 0, y: -100, filter: 'blur(10px)' }} 
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 style={{...styles.glitchTitle, fontFamily: currentFont}}>
            PDFly
          </h1>
        </motion.div>
      </section>


      {/* --- SECTION 2: HOW IT WORKS --- */}
      <motion.section 
        style={styles.sectionBlock}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Trigger earlier
        variants={revealVariants}
      >
        <div style={styles.contentWrapper}>
          <h2 style={styles.sectionHeader}>How It Works</h2>
          
          <motion.div 
            style={styles.grid}
            variants={staggerContainer}
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


      {/* --- SECTION 3: SOCIAL PROOF --- */}
      <motion.section 
        style={styles.sectionBlock}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Trigger earlier
        variants={revealVariants}
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


      {/* --- SECTION 4: CTA --- */}
      <motion.section 
        style={{...styles.sectionBlock, justifyContent: 'center'}}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Trigger earlier
        variants={revealVariants}
      >
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center' 
        }}>
          <h2 style={styles.ctaHeadline}>Ready to simplify?</h2>
          <Link href="/analyzer" style={{ textDecoration: 'none' }}>
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
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        body { margin: 0; background-color: #121212; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
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

// STYLES (Your Perfect Colors)
const styles = {
  container: {
    backgroundColor: '#121212', // DEEP CHARCOAL
    color: '#ffffff',
    minHeight: '100vh',
    padding: '40px 20px', 
    display: 'flex',
    flexDirection: 'column',
    gap: '60px',
    position: 'relative',
    overflow: 'hidden',
  },

  gridBackground: {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    zIndex: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'gridMove 20s linear infinite',
    opacity: 0.5,
  },

  sectionBlock: {
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)', // Brighter Glass
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minHeight: '80vh', // Perfect height for breathing room
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  },

  glitchTitle: { fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: '900', letterSpacing: '2px', color: '#fff', transition: 'font-family 0.2s ease', textAlign: 'center', margin: 0 },
  
  contentWrapper: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
  sectionHeader: { fontSize: '3rem', textAlign: 'center', marginBottom: '80px', fontWeight: 'bold', color: '#fff' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', width: '100%' },
  
  stepCard: { padding: '40px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s' },
  stepIcon: { marginBottom: '20px', opacity: 1 },
  stepTitle: { fontSize: '1.5rem', marginBottom: '10px', color: '#fff' },
  stepDesc: { color: '#e5e5e5', lineHeight: '1.6', fontSize: '1.1rem' },

  sliderContainer: { width: '100%', overflow: 'hidden' },
  sliderTrack: { display: 'flex', gap: '20px', width: 'max-content', animation: 'scroll 40s linear infinite' },
  
  reviewCard: { width: '300px', padding: '25px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', flexShrink: 0 },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  reviewName: { fontSize: '14px', fontWeight: 'bold', color: '#fff' },
  stars: { display: 'flex', gap: '2px', marginTop: '2px' },
  reviewText: { color: '#eee', fontStyle: 'italic', fontSize: '15px' },

  ctaHeadline: { fontSize: '4rem', marginBottom: '40px', color: '#fff', fontWeight: 'bold' },
  finalButton: { padding: '25px 60px', fontSize: '1.5rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold', textDecoration: 'none' },
};
