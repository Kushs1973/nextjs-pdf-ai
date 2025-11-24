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

// --- ANIMATION VARIANTS ---
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

// --- WHITE HOLOGRAPHIC HOVER ---
const cardHover = {
  rest: { scale: 1, borderColor: "rgba(255, 255, 255, 0.05)", backgroundColor: "rgba(255,255,255,0.05)" },
  hover: { 
    scale: 1.03, 
    borderColor: "rgba(255, 255, 255, 0.8)", 
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)", 
    y: -5,
    transition: { duration: 0.3 }
  }
};

const iconSpin = {
  rest: { rotate: 0, color: "#fff" },
  hover: { rotate: 360, scale: 1.2, color: "#ffffff", transition: { duration: 0.5 } }
};

export default function LandingPage() {
  
  const [currentFont, setCurrentFont] = useState(avenirLike.style.fontFamily);
  const [glitchActive, setGlitchActive] = useState(false); 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150); 
    }, 400);

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div style={styles.container} className={outfit.className}>
      
      {/* BACKGROUND LAYERS */}
      <div style={styles.gridBackground}></div>
      <div 
        style={{
          ...styles.spotlightLayer,
          maskImage: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      ></div>

      {/* --- SECTION 1: HERO --- */}
      {/* This one needs to be centered, so we keep justifyContent: center here manually */}
      <motion.section 
        style={{...styles.sectionBlock, justifyContent: 'center'}}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={revealVariants}
      >
        <motion.h1 
          style={{...styles.glitchTitle, fontFamily: currentFont}}
          animate={glitchActive ? { 
            x: [-5, 5, -5, 0], 
            skewX: [-10, 10, -5, 0], 
            opacity: [1, 0.8, 1],
            scale: [1, 1.02, 1]
          } : { x: 0, skewX: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          PDFly
        </motion.h1>
      </motion.section>


      {/* --- SECTION 2: HOW IT WORKS --- */}
      <motion.section 
        style={styles.sectionBlock}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={revealVariants}
      >
        <div style={styles.contentWrapper}>
          <h2 style={styles.sectionHeader}>How It Works</h2>
          
          <motion.div 
            style={styles.flexGrid} 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* CARD 1 */}
            <motion.div style={styles.stepCardContainer} variants={revealVariants}>
              <motion.div style={styles.cardContent} variants={cardHover} initial="rest" whileHover="hover" animate="rest">
                <motion.div style={styles.stepIcon} variants={iconSpin}>
                  <Upload size={24} />
                </motion.div>
                <h3 style={styles.stepTitle}>1. Upload</h3>
                <p style={styles.stepDesc}>Drag & drop any PDF or Image file into the secure vault.</p>
              </motion.div>
            </motion.div>

            {/* CARD 2 */}
            <motion.div style={styles.stepCardContainer} variants={revealVariants}>
              <motion.div style={styles.cardContent} variants={cardHover} initial="rest" whileHover="hover" animate="rest">
                <motion.div style={styles.stepIcon} variants={iconSpin}>
                  <Zap size={24} />
                </motion.div>
                <h3 style={styles.stepTitle}>2. Analyze</h3>
                <p style={styles.stepDesc}>Our AI scans every pixel and letter instantly.</p>
              </motion.div>
            </motion.div>

            {/* CARD 3 */}
            <motion.div style={styles.stepCardContainer} variants={revealVariants}>
              <motion.div style={styles.cardContent} variants={cardHover} initial="rest" whileHover="hover" animate="rest">
                <motion.div style={styles.stepIcon} variants={iconSpin}>
                  <FileText size={24} />
                </motion.div>
                <h3 style={styles.stepTitle}>3. Insight</h3>
                <p style={styles.stepDesc}>Get structured summaries and executive briefs.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      {/* --- SECTION 3: SOCIAL PROOF --- */}
      <motion.section 
        style={styles.sectionBlock}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={revealVariants}
      >
        <h2 style={styles.sectionHeader}>Trusted by Analysts</h2>
        
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
        viewport={{ once: true, amount: 0.5 }}
        variants={revealVariants}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={styles.ctaHeadline}>Ready to simplify?</h2>
          <Link href="/analyzer" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.5)" }}
              whileTap={{ scale: 0.95 }}
              style={styles.finalButton}
            >
              <div style={styles.shimmer}></div>
              <span style={{zIndex: 2, display: 'flex', alignItems: 'center', gap: '10px'}}>
                Launch PDFly <ArrowRight size={20} />
              </span>
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
        @keyframes shimmerMove {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
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

// STYLES
const styles = {
  container: {
    backgroundColor: '#121212',
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
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0,
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    animation: 'gridMove 20s linear infinite',
    opacity: 0.3,
  },
  spotlightLayer: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0,
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    animation: 'gridMove 20s linear infinite',
    pointerEvents: 'none',
  },

  sectionBlock: {
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minHeight: '80vh',             
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // FIXED: Pushes content to TOP
    alignItems: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    paddingTop: '100px', // FIXED: Adds space at top for Header
  },

  glitchTitle: { fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: '900', letterSpacing: '2px', color: '#fff', textAlign: 'center', margin: 'auto' }, // Center logo vertically
  
  // WRAPPER that takes full height to space out children
  contentWrapper: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    width: '100%',
    height: '100%', // Take full height of section
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Start from top
    alignItems: 'center'
  },
  
  sectionHeader: { fontSize: '3rem', textAlign: 'center', marginBottom: '0px', fontWeight: 'bold', color: '#fff' },

  // GRID FIXED
  flexGrid: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: '30px', 
    width: '100%',
    marginTop: 'auto', // FIXED: Pushes Grid to vertical center/bottom
    marginBottom: 'auto',
  },
  
  stepCardContainer: { 
    position: 'relative',
    flex: '1 1 300px',  
    maxWidth: '380px',  
    minWidth: '280px',
  },
  
  cardContent: { 
    padding: '40px', 
    borderRadius: '20px', 
    border: '1px solid rgba(255,255,255,0.05)', 
    backgroundColor: 'rgba(255,255,255,0.05)',
    cursor: 'default',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  
  stepIcon: { marginBottom: '20px', color: '#fff' },
  stepTitle: { fontSize: '1.5rem', marginBottom: '10px', color: '#fff' },
  stepDesc: { color: '#e5e5e5', lineHeight: '1.6', fontSize: '1.1rem', textAlign: 'left' },

  // Slider: Pushes to center of its section
  sliderContainer: { width: '100%', overflow: 'hidden', marginTop: 'auto', marginBottom: 'auto' },
  sliderTrack: { display: 'flex', gap: '20px', width: 'max-content', animation: 'scroll 40s linear infinite' },
  
  reviewCard: { width: '300px', padding: '25px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', flexShrink: 0 },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  reviewName: { fontSize: '14px', fontWeight: 'bold', color: '#fff' },
  stars: { display: 'flex', gap: '2px', marginTop: '2px' },
  reviewText: { color: '#eee', fontStyle: 'italic', fontSize: '15px' },

  ctaHeadline: { fontSize: '4rem', marginBottom: '40px', color: '#fff', fontWeight: 'bold' },
  
  finalButton: { 
    padding: '25px 60px', 
    fontSize: '1.5rem', 
    backgroundColor: '#fff', 
    color: '#000', 
    border: 'none', 
    borderRadius: '100px', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px', 
    fontWeight: 'bold', 
    textDecoration: 'none',
    position: 'relative', 
    overflow: 'hidden'
  },
  shimmer: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(120deg, transparent, rgba(0,0,0,0.2), transparent)',
    animation: 'shimmerMove 3s infinite',
  }
};
