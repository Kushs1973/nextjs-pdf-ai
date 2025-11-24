"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';

// Load the "Cool Font"
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '700'] });

export default function LandingPage() {
  return (
    <div style={styles.container} className={spaceGrotesk.className}>
      {/* Background Gradient Effect */}
      <div style={styles.gradient}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={styles.content}
      >
        <h1 style={styles.title}>
          PDF <span style={{ color: '#888' }}>Analyst_AI</span>
        </h1>
        
        <p style={styles.description}>
          Turn complex documents into clear, structured insights. 
          <br /> Powered by GPT-4o.
        </p>

        <Link href="/analyzer">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#000000' }}
            whileTap={{ scale: 0.95 }}
            style={styles.button}
          >
            Launch App &rarr;
          </motion.button>
        </Link>

        <div style={styles.footer}>
          <p>Secure. Private. Intelligent.</p>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#050505',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: '-20%',
    left: '-20%',
    width: '140%',
    height: '140%',
    background: 'radial-gradient(circle, rgba(50,50,50,0.2) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0,
  },
  content: {
    zIndex: 1,
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '5rem',
    fontWeight: '700',
    letterSpacing: '-2px',
    marginBottom: '20px',
    lineHeight: '1',
  },
  description: {
    fontSize: '1.2rem',
    color: '#a1a1a1',
    maxWidth: '500px',
    margin: '0 auto 40px auto',
    lineHeight: '1.6',
  },
  button: {
    padding: '16px 40px',
    fontSize: '1.1rem',
    borderRadius: '50px',
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.3s',
  },
  footer: {
    marginTop: '60px',
    fontSize: '0.8rem',
    color: '#444',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  }
};
