import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber = ({ 
  value, 
  decimals = 2, 
  className = '',
  prefix = '',
  suffix = ''
}: AnimatedNumberProps) => {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => 
    `${prefix}${current.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
};
