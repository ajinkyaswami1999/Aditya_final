'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after progress completes
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Remove preloader completely
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`preloader-enhanced ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="preloader-content">
        {/* Animated Logo */}
        <div className="logo-container">
          <div className="logo-text">
            <span className="logo-2">2</span>
            <span className="logo-6">6</span>
            <span className="logo-as">AS</span>
          </div>
          <div className="logo-underline"></div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <span>D</span><span>E</span><span>S</span><span>I</span><span>G</span><span>N</span>
          <span className="space"></span>
          <span>S</span><span>T</span><span>U</span><span>D</span><span>I</span><span>O</span>
        </div>

        {/* Rotating Elements */}
        <div className="rotating-elements">
          <div className="rotate-element rotate-1"></div>
          <div className="rotate-element rotate-2"></div>
          <div className="rotate-element rotate-3"></div>
        </div>
      </div>

      {/* Loading Dots */}
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}