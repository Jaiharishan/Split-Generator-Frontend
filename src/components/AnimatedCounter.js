import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ 
  value, 
  duration = 1000, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 2 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsAnimating(true);
      
      const startValue = prevValueRef.current;
      const endValue = value;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
        }
      };
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(animate);
      prevValueRef.current = value;
    }
  }, [value, duration]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const formatValue = (val) => {
    if (decimals === 0) {
      return Math.round(val).toString();
    }
    return val.toFixed(decimals);
  };

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
};

export default AnimatedCounter; 