"use client";

import { Button } from "@/components/ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Image as ImageIcon, Headphones, Globe, Shield, Play, Heart, Download } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const TypewriterText = ({ text, delay = 0, speed = 0.04 }: { text: string, delay?: number, speed?: number }) => {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: speed, delayChildren: delay } }
      }}
      aria-label={text}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 5, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const QRCodeSection = () => {
    const handleDownload = () => {
        const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "Sensaura_QRCode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <section className="relative z-10 pt-10 pb-40 px-4 flex flex-col items-center justify-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="p-12 rounded-[3rem] border border-white/10 bg-black/40 relative overflow-hidden flex flex-col items-center gap-8 shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none" />
                
                <div className="text-center relative z-10">
                    <h3 className="text-4xl font-heading text-white mb-2">Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">Sensaura</span></h3>
                    <p className="text-white/60 font-light tracking-wide">Scan to access the platform easily on mobile</p>
                </div>
                
                <div className="p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.3)] relative z-10">
                    <QRCodeCanvas 
                        id="qr-code-canvas" 
                        value="https://sensaura.vercel.app/" 
                        size={220} 
                        bgColor="#ffffff" 
                        fgColor="#000000" 
                        level="H"
                        includeMargin={false}
                    />
                </div>

                <button 
                    onClick={handleDownload}
                    className="relative z-10 px-8 py-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(176,38,255,0.4)]"
                >
                    <Download className="w-5 h-5" />
                    Download QR Code
                </button>
            </motion.div>
        </section>
    );
};

const InteractiveCTA = () => {
  const [ctaMousePos, setCtaMousePos] = useState({ x: 500, y: 500 });
  const rafRef = useRef<number | null>(null);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setCtaMousePos({ x: targetX, y: targetY });
    });
  };

  return (
        <div 
          className="max-w-6xl mx-auto rounded-[3rem] border border-white/10 bg-black/40 overflow-hidden relative group cursor-crosshair transform-gpu"
          onMouseMove={handleCtaMouseMove}
        >
          {/* Interactive Spotlight */}
          <div 
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen"
            style={{
              willChange: "background",
              background: `radial-gradient(800px circle at ${ctaMousePos.x}px ${ctaMousePos.y}px, rgba(176,38,255,0.15), transparent 40%)`
            }}
          />
          <div 
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen"
            style={{
              willChange: "background",
              background: `radial-gradient(300px circle at ${ctaMousePos.x}px ${ctaMousePos.y}px, rgba(0,243,255,0.3), transparent 50%)`
            }}
          />
          <div 
            className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none" 
          />

          <div className="relative z-10 py-32 px-10 text-center flex flex-col items-center justify-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
              <div className="inline-block py-2 px-6 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8">
                <span className="text-neon-cyan font-medium text-sm tracking-widest uppercase">Your Masterpiece Awaits</span>
              </div>
              
              <div 
                className="relative cursor-crosshair group/text mb-12"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
                }}
              >
                {/* Base Dark Text */}
                <div className="text-white/[0.03] transition-colors duration-500">
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    Let your soul be seen.
                  </h2>
                  <h2 className="font-heading text-4xl md:text-6xl">
                    Let your story be heard.
                  </h2>
                </div>

                {/* Glowing Revealed Text */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover/text:opacity-100 transition-opacity duration-300 transform-gpu"
                  style={{
                    willChange: "mask-image, -webkit-mask-image",
                    maskImage: 'radial-gradient(150px circle at var(--x, 50%) var(--y, 50%), black 20%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(150px circle at var(--x, 50%) var(--y, 50%), black 20%, transparent 100%)'
                  }}
                >
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    Let your soul be <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">seen.</span>
                  </h2>
                  <h2 className="font-heading text-4xl md:text-6xl text-neon-pink drop-shadow-[0_0_20px_rgba(255,42,133,0.5)]">
                    Let your story be heard.
                  </h2>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-8 relative"
              >
                {/* Glowing decorative line */}
                <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-neon-pink to-transparent mx-auto mb-10 opacity-50" />
                
                <p className="text-2xl md:text-3xl font-light text-white/80 italic tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  An exclusive sanctuary for visionaries to express what words cannot.
                </p>
                <div className="flex items-center justify-center gap-4 mt-8 text-neon-cyan/60">
                  <Sparkles className="w-4 h-4 animate-pulse duration-1000" />
                  <span className="uppercase tracking-[0.3em] text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">No Algorithms. Just Pure Emotion.</span>
                  <Sparkles className="w-4 h-4 animate-pulse duration-1000" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
  );
};

const AboutProjectSection = () => {
    return (
        <section className="relative z-10 py-32 px-4 max-w-6xl mx-auto border-t border-white/5">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">About the project</h2>
                <div className="inline-block py-2 px-6 rounded-full border border-neon-pink/30 bg-neon-pink/5 mb-6">
                    <span className="text-neon-pink font-medium text-sm tracking-widest uppercase">SENSAURA: How does your soul speak?</span>
                </div>
                <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
                    A 24-page mixed media zine combining papercraft, traditional art, and digital workflows into a unified emotional canvas.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-2xl font-semibold mb-6 text-neon-pink drop-shadow-[0_0_8px_rgba(255,42,133,0.5)] relative z-10 flex items-center gap-3">
                        <Heart className="w-6 h-6" /> The Vision
                    </h3>
                    <p className="text-white/70 leading-relaxed mb-6 font-light relative z-10 text-lg">
                        Rooted in the DIY zine community and driven by vibrant hot pink themes, this collective project weaves together personal narratives, profound poetry, and expressive visual art. It is a shared journey exploring corporality, human identities, memory, and culture.
                    </p>
                    <p className="text-white/70 leading-relaxed font-light relative z-10 text-lg">
                        Through evocative writings like <span className="italic text-white">"Just Words,"</span> <span className="italic text-white">"Growing Pains,"</span> and <span className="italic text-white">"I Burn Slow,"</span> the project acts as an emotional archive—reflecting our raw vulnerabilities and pure expressions of the soul, all waiting to be heard.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-bl from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-2xl font-semibold mb-8 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] relative z-10 flex items-center gap-3">
                        <Sparkles className="w-6 h-6" /> The Creators
                    </h3>
                    <ul className="space-y-6 text-white/70 font-light relative z-10">
                        <li className="flex flex-col">
                            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple text-lg tracking-wide drop-shadow-[0_0_5px_rgba(255,42,133,0.5)]">Saskia Crisconio</strong>
                            <span className="text-sm">Creative writing & group process coordination.</span>
                        </li>
                        <li className="flex flex-col">
                            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink text-lg tracking-wide drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">Aya Vrantzoglou</strong>
                            <span className="text-sm">Collaborative writing & core creative concept.</span>
                        </li>
                        <li className="flex flex-col">
                            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan text-lg tracking-wide drop-shadow-[0_0_5px_rgba(176,38,255,0.5)]">Xhela Mocka</strong>
                            <span className="text-sm">Visual artwork creation & physical zine production.</span>
                        </li>
                        <li className="flex flex-col">
                            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-white text-lg tracking-wide drop-shadow-[0_0_5px_rgba(255,42,133,0.5)]">Leen Jaafar</strong>
                            <span className="text-sm">Layout framing & visual orchestration.</span>
                        </li>
                        <li className="flex flex-col">
                            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple text-lg tracking-wide drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">Anh Tuan Dang (JT)</strong>
                            <span className="text-sm">Web development to deliver this creative energy to the world.</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </section>
    );
};

export default function SensauraLanding() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax for Hero
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#030303] text-[#fafafa] overflow-hidden selection:bg-white/10">
      
      {/* Dynamic Animated Background & Moving Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft, Slow-Moving Gradient Orbs */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform", background: "radial-gradient(circle, rgba(176,38,255,0.15) 0%, transparent 60%)" }}
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full transform-gpu mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform", background: "radial-gradient(circle, rgba(0,243,255,0.15) 0%, transparent 60%)" }}
          className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full transform-gpu mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity", background: "radial-gradient(circle, rgba(255,42,133,0.1) 0%, transparent 60%)" }}
          className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] rounded-full transform-gpu mix-blend-screen" 
        />
        
        {/* Abstract Art & Music Pattern */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Faint Vertical Background Lines */}
          <div 
            className="absolute inset-0 flex items-center justify-center gap-4 md:gap-6 w-full opacity-10"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
            }}
          >
            {Array.from({ length: 60 }).map((_, i) => (
               <div key={`bg-line-${i}`} className="w-[1px] h-full bg-neon-purple/50 inline-block shrink-0" />
            ))}
          </div>

          {/* Abstract Hand-Drawn Background Pattern */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.1] mix-blend-screen pointer-events-none">
            <svg viewBox="0 0 1000 1000" className="w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] min-w-[800px] min-h-[800px] absolute" preserveAspectRatio="xMidYMid slice">
              {/* Giant looping swoops */}
              <motion.path 
                d="M 100 800 C 400 100, 600 900, 900 200 C 1100 -300, 100 1200, 500 500 C 900 -200, -100 1100, 100 800 Z"
                fill="transparent"
                stroke="url(#neon-draw-grad)"
                strokeWidth="1.5"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
              <motion.path 
                d="M -200 500 Q 500 -200, 1200 500 T 500 1200 T -200 500"
                fill="transparent"
                stroke="url(#neon-draw-grad-2)"
                strokeWidth="1"
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
              />
              <defs>
                <linearGradient id="neon-draw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff2a85" />
                  <stop offset="50%" stopColor="#00f3ff" />
                  <stop offset="100%" stopColor="#b026ff" />
                </linearGradient>
                <linearGradient id="neon-draw-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f3ff" />
                  <stop offset="100%" stopColor="#ff2a85" />
                </linearGradient>
              </defs>
            </svg>
          </div>

        </div>

        {/* Floating Abstract Art Wireframes */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] border-[1px] border-white/[0.04] rounded-full border-dashed hidden md:block"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[65vw] border-[2px] border-neon-purple/[0.04] rounded-[38%] mix-blend-screen hidden md:block"
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] border-[1px] border-neon-cyan/[0.03] rounded-[45%] mix-blend-screen hidden md:block"
        />
      </div>

      {/* 1. HERO SECTION */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center pt-20"
      >

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 className="relative inline-block font-heading text-7xl md:text-8xl lg:text-9xl mb-8 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <span className="relative z-10"><TypewriterText text="Sensaura" delay={0.2} speed={0.12} /></span>
            
            {/* Hand-drawn accent underline */}
            <svg className="absolute -bottom-2 md:-bottom-6 left-0 w-full h-8 overflow-visible pointer-events-none z-0" viewBox="0 0 200 20" preserveAspectRatio="none">
              <motion.path 
                d="M 5 25 Q 100 45, 195 5" 
                fill="none" 
                stroke="url(#neon-pink-grad-line)" 
                strokeWidth="6" 
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                className="drop-shadow-[0_0_12px_rgba(255,42,133,0.8)]"
              />
              <defs>
                <linearGradient id="neon-pink-grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff2a85" stopOpacity="0" />
                  <stop offset="20%" stopColor="#ff2a85" />
                  <stop offset="80%" stopColor="#ff2a85" />
                  <stop offset="100%" stopColor="#b026ff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </h1>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 italic text-white/80">
            <TypewriterText text='"How does your soul speak?"' delay={1.4} speed={0.06} />
          </h2>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            <TypewriterText text="Turn your emotions into art. Let the world feel what you feel." delay={3.2} speed={0.03} />
          </p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 5.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/auth/register">
              <Button className="h-14 px-8 text-lg rounded-full group relative overflow-hidden bg-white text-black hover:bg-white/90 shadow-[0_0_30px_-5px_var(--color-neon-pink)] transition-all">
                <span className="relative flex items-center z-10 font-medium">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating
                </span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="h-14 px-8 text-lg rounded-full border border-white/20 hover:bg-white/10 text-white transition-all">
                Explore Creations
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 2. EMOTIONAL STORY SECTION */}
      <section className="relative z-10 py-32 px-4 max-w-5xl mx-auto text-center border-t border-white/5">
        <div>
          <h3 className="text-3xl md:text-5xl font-light leading-snug mb-16">
            <TypewriterText text="Every creation carries a feeling." speed={0.05} />
            <br/>
            <span className="font-heading text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple drop-shadow-[0_0_10px_rgba(255,42,133,0.5)] leading-[1.5]">
              <TypewriterText text="Every feeling deserves to be heard." delay={2} speed={0.07} />
            </span>
          </h3>

          {/* New Chunky Soundwave Animation */}
          <div className="flex items-center justify-center gap-2 md:gap-3 w-full max-w-xl mx-auto mt-16 h-48">
            {[10, 12, 24, 26, 15, 22, 6, 8, 16, 22, 9, 8, 9, 15, 14].map((baseHeight, i) => (
               <motion.div 
                 key={'chunky-wave-'+i}
                 className="w-2.5 md:w-3.5 shrink-0 rounded-full bg-gradient-to-b from-[#00f3ff] to-[#bd26ff] shadow-[0_0_25px_rgba(0,243,255,0.7)]"
                 animate={{ 
                   height: [
                     `${baseHeight * 6}px`, 
                     `${baseHeight * 6 * (1.2 + Math.random() * 0.3)}px`, 
                     `${baseHeight * 6 * (0.6 + Math.random() * 0.2)}px`,
                     `${baseHeight * 6}px`
                   ],
                 }}
                 transition={{ 
                   duration: 0.7 + (Math.abs(Math.sin(i)) * 0.5), 
                   repeat: Infinity, 
                   ease: "easeInOut",
                   delay: i * 0.05
                 }}
               />
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS - VISUALIZED STEP-BY-STEP */}
      <section className="relative z-10 py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How Sensaura Works</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            A seamless journey from raw emotion to a shared masterpiece.
          </p>
        </div>

        <div className="space-y-40">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div 
               initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
               className="flex-1 w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-neon-pink/20 text-neon-pink flex items-center justify-center font-bold text-2xl font-heading shadow-[0_0_15px_rgba(255,42,133,0.4)]">1</div>
                <h3 className="text-3xl md:text-4xl font-semibold">Upload Your Art</h3>
              </div>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Start by uploading your visual masterpiece. Whether it’s a digital painting, photography, or a mixed media concept, this is your boundless canvas.
              </p>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3"><Sparkles className="w-6 h-6 text-neon-pink drop-shadow-[0_0_8px_#ff2a85]" /> Lossless image quality</li>
                <li className="flex items-center gap-3"><Shield className="w-6 h-6 text-neon-pink drop-shadow-[0_0_8px_#ff2a85]" /> Secure copyright protection</li>
              </ul>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="flex-1 w-full"
            >
              {/* Abstract UI Mockup for Step 1 */}
              <div className="aspect-[4/3] rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-full h-full border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center flex-col gap-6 group-hover:border-neon-pink/50 group-hover:bg-neon-pink/5 transition-all duration-500 relative z-10">
                  <ImageIcon className="w-16 h-16 text-white/30 group-hover:text-neon-pink transition-colors duration-500 group-hover:scale-110" />
                  <span className="text-white/40 font-medium text-lg">Drag & Drop Artwork</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <motion.div 
               initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
               className="flex-1 w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-bold text-2xl font-heading shadow-[0_0_15px_rgba(0,243,255,0.4)]">2</div>
                <h3 className="text-3xl md:text-4xl font-semibold">Sync the Soundtrack</h3>
              </div>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Visuals are only half the story. Attach a Spotify track, a SoundCloud link, or upload your own ambient audio to perfectly score your art and evoke the true emotion.
              </p>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3"><Headphones className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_8px_#00f3ff]" /> Seamless audio streaming</li>
                <li className="flex items-center gap-3"><Heart className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_8px_#00f3ff]" /> Emotional resonance matching</li>
              </ul>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="flex-1 w-full relative"
            >
              {/* Abstract UI Mockup for Step 2 */}
              <div className="aspect-[4/3] rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-8 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-bl from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Music Player Mockup */}
                <div className="w-full max-w-md bg-black/60 border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10 backdrop-blur-xl group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan animate-pulse shadow-[0_0_20px_rgba(0,243,255,0.3)]" />
                    <div className="flex-1">
                      <div className="w-3/4 h-4 bg-white/20 rounded-full mb-3" />
                      <div className="w-1/2 h-3 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-white/40">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-neon-cyan/20 transition-colors cursor-pointer group-hover:text-neon-cyan"><Play className="w-4 h-4 ml-1" /></div>
                    <div className="flex-1 mx-6 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }} whileInView={{ width: "40%" }} transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div 
               initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
               className="flex-1 w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center font-bold text-2xl font-heading shadow-[0_0_15px_rgba(176,38,255,0.4)]">3</div>
                <h3 className="text-3xl md:text-4xl font-semibold">Share the Experience</h3>
              </div>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Publish your creation to the global feed. Watch as visitors don their headphones and immerse themselves completely in your emotional landscape.
              </p>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3"><Globe className="w-6 h-6 text-neon-purple drop-shadow-[0_0_8px_#b026ff]" /> Global community reach</li>
                <li className="flex items-center gap-3"><Sparkles className="w-6 h-6 text-neon-purple drop-shadow-[0_0_8px_#b026ff]" /> Authentic, deep interactions</li>
              </ul>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="flex-1 w-full"
            >
              {/* Abstract UI Mockup for Step 3 */}
              <div className="aspect-[4/3] rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Social Post Mockup */}
                <div className="w-full max-w-md bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10 backdrop-blur-xl group-hover:scale-105 transition-transform duration-500">
                  <div className="h-48 bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 relative group-hover:from-neon-pink/30 group-hover:to-neon-purple/30 transition-colors duration-500">
                    <div className="absolute inset-0 flex items-center justify-center blur-[2px] group-hover:blur-0 transition-all duration-500">
                      <div className="w-16 h-16 rounded-full bg-black/60 border border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(176,38,255,0.5)] cursor-pointer hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-white/20" />
                      <div className="w-24 h-3 bg-white/20 rounded-full" />
                    </div>
                    <Heart className="w-6 h-6 text-neon-pink drop-shadow-[0_0_12px_#ff2a85] cursor-pointer" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE SHOWCASE */}
      <section className="relative z-10 py-32 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Creators</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Everything you need to express your truest self. Secure, immersive, and boundaryless.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {[
            { 
              icon: Sparkles, 
              title: "Artistic Freedom", 
              desc: "Upload any form of visual art—digital, traditional, or mixed media. Your expression has no limits and your canvas is boundless.",
              accent: "from-[#ff2a85] to-[#ff7eb3]",
              glowHover: "hover:shadow-[0_0_50px_rgba(255,42,133,0.15)]",
              iconColor: "text-[#ff2a85] drop-shadow-[0_0_12px_rgba(255,42,133,0.8)]",
              borderHover: "hover:border-[#ff2a85]/40",
              bgHover: "hover:bg-[#ff2a85]/[0.02]"
            },
            { 
              icon: Headphones, 
              title: "Immersive Audio Experience", 
              desc: "Don't just show; make them feel. Pair your visuals with the exact track or original ambient audio that inspired your creation.",
              accent: "from-[#00f3ff] to-[#0088ff]",
              glowHover: "hover:shadow-[0_0_50px_rgba(0,243,255,0.15)]",
              iconColor: "text-[#00f3ff] drop-shadow-[0_0_12px_rgba(0,243,255,0.8)]",
              borderHover: "hover:border-[#00f3ff]/40",
              bgHover: "hover:bg-[#00f3ff]/[0.02]"
            },
            { 
              icon: Globe, 
              title: "Global Deep Connection", 
              desc: "Connect with peers worldwide who share your exact aesthetic and musical vibe. It's not about numbers; it's about actual resonance.",
              accent: "from-[#b026ff] to-[#c77dff]",
              glowHover: "hover:shadow-[0_0_50px_rgba(176,38,255,0.15)]",
              iconColor: "text-[#b026ff] drop-shadow-[0_0_12px_rgba(176,38,255,0.8)]",
              borderHover: "hover:border-[#b026ff]/40",
              bgHover: "hover:bg-[#b026ff]/[0.02]"
            },
            { 
              icon: Shield, 
              title: "Verified Trust & Safety", 
              desc: "You own your feelings and your art. We actively protect creators' rights and foster a positive, supportive community devoid of toxicity.",
              accent: "from-[#00ff88] to-[#00b359]",
              glowHover: "hover:shadow-[0_0_50px_rgba(0,255,136,0.1)]",
              iconColor: "text-[#00ff88] drop-shadow-[0_0_12px_rgba(0,255,136,0.8)]",
              borderHover: "hover:border-[#00ff88]/40",
              bgHover: "hover:bg-[#00ff88]/[0.02]"
            }
          ].map((feature, i) => {
            const isActive = activeFeature === i;
            return (
            <motion.div
              layout
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: isActive ? 0 : -4, scale: isActive ? 1 : 1.01 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.15 }}
              onClick={() => setActiveFeature(isActive ? null : i)}
              className={`group relative p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl transition-all duration-500 overflow-hidden cursor-pointer ${feature.glowHover} ${feature.borderHover} ${feature.bgHover} ${isActive ? 'ring-1 ring-white/20 shadow-2xl scale-[1.02] bg-white/[0.06]' : ''}`}
            >
              {/* Trust-evoking "Scan Line" animation on hover instead of just static opacity */}
              <div className={`absolute top-0 left-[-100%] w-[200%] h-[2px] opacity-0 group-hover:opacity-100 group-hover:animate-[draw_2s_ease-in-out_infinite] bg-gradient-to-r transparent ${feature.accent} transparent transition-opacity duration-500 ${isActive ? 'opacity-100 left-0 animate-none' : ''}`} />
              
              <motion.div layout className="flex flex-col items-center text-center gap-4">
                <div className={`shrink-0 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors duration-500 relative ${isActive ? 'bg-white/10' : ''}`}>
                  {/* Subtle inner pulse denoting active system/security */}
                  <div className={`absolute inset-0 rounded-2xl border border-white/20 scale-105 opacity-0 transition-all duration-700 ${isActive ? 'opacity-100' : 'group-hover:opacity-100 group-hover:animate-pulse'}`} />
                  
                  <feature.icon className={`w-8 h-8 ${feature.iconColor} transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                </div>
                <h4 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                  {feature.title}
                  {feature.title === "Verified Trust & Safety" && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.8 }}
                      className="inline-flex w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" 
                    />
                  )}
                </h4>
              </motion.div>

              <motion.div
                layout
                initial={false}
                animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0, marginTop: isActive ? 16 : 0 }}
                className="overflow-hidden text-center"
              >
                <p className="text-white/60 text-sm leading-relaxed pb-2">{feature.desc}</p>
              </motion.div>
            </motion.div>
          )})}
        </div>
      </section>

      {/* 5. WHY CHOOSE SENSAURA */}
      <section className="relative z-10 py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Creators Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple drop-shadow-[0_0_10px_rgba(255,42,133,0.5)]">Sensaura.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            A sanctuary built to honor your deepest expressions, not just algorithm engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          
          {/* Card 1 - Wide - Zero Algorithms */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="md:col-span-2 relative p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col md:flex-row items-center gap-8 overflow-hidden group hover:bg-white/[0.04] transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-6 border border-neon-cyan/20">
                <Globe className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Zero Algorithms. Pure Reach.</h3>
              <p className="text-white/60 leading-relaxed">
                Tired of the infinite scroll that buries your masterpiece seconds after uploading? Sensaura doesn't rely on hidden algorithms to show what's popular. We ensure every creation reaches the community authentically and chronologically, restoring the pure joy of discovering art.
              </p>
            </div>
            <div className="w-full relative z-10 md:w-64 aspect-video md:aspect-[3/4] bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549492423-400259a2e574?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-screen opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
               <div className="flex items-center gap-2 z-10 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
                 <span className="text-neon-cyan font-medium text-sm tracking-wide">Authentic Feed</span>
               </div>
            </div>
          </motion.div>

          {/* Card 2 - Square - Lossless Quality */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] overflow-hidden group hover:bg-white/[0.04] transition-colors flex flex-col justify-end min-h-[300px]"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518640045958-857eaf483e57?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0 transition-opacity duration-500 group-hover:opacity-80" />
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-3 drop-shadow-lg text-white">Lossless Quality</h3>
              <p className="text-white/70 text-sm leading-relaxed drop-shadow-lg">
                Your colors, textures, and details matter. Sensaura preserves your high-resolution original files perfectly, ensuring no pixel is compromised.
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Square - Emotional Sync */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 relative p-8 md:p-10 rounded-3xl bg-[#050505] border border-white/[0.05] overflow-hidden group hover:border-white/[0.1] transition-colors flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-pink/10 via-transparent to-neon-purple/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
               <div>
                  <div className="w-12 h-12 rounded-full border border-neon-pink/30 flex items-center justify-center mb-6 text-neon-pink group-hover:bg-neon-pink/10 group-hover:shadow-[0_0_15px_rgba(255,42,133,0.3)] transition-all">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Symphonic Resonance</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Audio changes everything. Combining your visual art with a curated musical track directly on Sensaura shifts casual scrolling into an immersive emotional experience.
                  </p>
               </div>
            </div>
            
            <div className="w-full flex items-center gap-1.5 mt-8 h-10 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className="flex-1 bg-gradient-to-t from-neon-pink to-neon-purple rounded-full mix-blend-screen" style={{ height: `${30 + Math.random()*70}%` }} />
               ))}
            </div>
          </motion.div>

          {/* Card 4 - Wide - Community */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 relative p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/[0.05] overflow-hidden group hover:bg-[#0c0c0c] transition-colors"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-purple/20 blur-[100px] rounded-full group-hover:opacity-100 transition-opacity opacity-50 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Deep Human Connection</h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  We swapped the toxic "like" metric for something deeper: Resonance. Connect with souls who genuinely understand your journey. Build a sanctuary portfolio alongside artists, musicians, and true appreciators of emotion.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-4 mr-2">
                     {[
                        "https://images.unsplash.com/photo-1549492423-400259a2e574?auto=format&fit=crop&q=60&w=100",
                        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=60&w=100",
                        "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=60&w=100",
                     ].map((src, i) => (
                       <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] overflow-hidden shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10" style={{ transitionDelay: `${i*100}ms` }}>
                           <img src={src} className="w-full h-full object-cover" alt="User avatar" />
                       </div>
                     ))}
                     <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 bg-black flex items-center justify-center shrink-0 z-0 text-white/50 text-xl font-light">
                       +
                     </div>
                  </div>
                  <span className="text-white/40 text-sm font-medium tracking-wide">Join 10k+ Creators</span>
                </div>
              </div>
              
              <div className="w-full md:w-auto h-full flex flex-col items-center justify-center aspect-square md:aspect-auto">
                 <div className="w-24 h-24 rounded-full bg-black border border-white/10 shadow-[0_0_40px_rgba(176,38,255,0.2)] group-hover:shadow-[0_0_50px_rgba(176,38,255,0.4)] transition-shadow duration-500 flex items-center justify-center relative">
                    <Heart className="w-8 h-8 text-neon-purple drop-shadow-[0_0_15px_#b026ff] animate-pulse" />
                    <div className="absolute inset-0 rounded-full border border-neon-purple/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                 </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 6. ABOUT THE PROJECT */}
      <AboutProjectSection />

      {/* 7. INTERACTIVE CALL TO ACTION */}
      <section className="relative z-10 pt-40 pb-10 px-4">
        <InteractiveCTA />
      </section>

      {/* 8. QR CODE SHARING */}
      <QRCodeSection />

      {/* 9. FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-heading text-3xl tracking-wide text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Sensaura</div>
          <div className="text-white/40 text-sm">© {new Date().getFullYear()} Sensaura Experience. All emotions respected.</div>
          <div className="flex items-center gap-6 text-white/50 text-sm font-medium">
            <Link href="#" className="hover:text-neon-cyan transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-neon-pink transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-neon-purple transition-colors">SoundCloud</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
