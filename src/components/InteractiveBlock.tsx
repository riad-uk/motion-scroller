'use client';

import { motion, useInView, useMotionValue, useTransform, animate, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function AnimatedNumber({ value, className, shouldAnimate }: { value: string; className?: string; shouldAnimate: boolean }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });
    const count = useMotionValue(0);
    
    // Extract numeric value from string (e.g., "£1 billion" -> 1, "56 years" -> 56, "£33mp" -> 33)
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    
    useEffect(() => {
        // Reset to 0 when shouldAnimate becomes true (user scrolled back to top)
        if (shouldAnimate && !isInView) {
            count.set(0);
        }
    }, [shouldAnimate, isInView, count]);
    
    useEffect(() => {
        if (isInView && shouldAnimate) {
            // Animate when in view and shouldAnimate is true
            const controls = animate(count, numericValue, {
                duration: 2,
                ease: "easeOut"
            });
            
            return controls.stop;
        } else if (isInView && !shouldAnimate) {
            // Show full number immediately if we shouldn't animate
            count.set(numericValue);
        }
    }, [isInView, count, numericValue, shouldAnimate]);
    
    useEffect(() => {
        const unsubscribe = count.on('change', (latest) => {
            if (ref.current) {
                // Format the number and add back the original text parts
                const formatted = Math.floor(latest);
                const prefix = value.match(/^[^0-9]*/)?.[0] || '';
                const suffix = value.match(/[^0-9]*$/)?.[0] || '';
                const middle = value.replace(/^[^0-9]*/, '').replace(/[0-9.]+/, '').replace(/[^0-9]*$/, '');
                
                ref.current.textContent = `${prefix}${formatted}${middle}${suffix}`;
            }
        });
        
        return unsubscribe;
    }, [count, value]);
    
    return (
        <motion.h3 
            ref={ref} 
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
        >
            {value}
        </motion.h3>
    );
}

function AnimatedHeading({ value, className, shouldAnimate }: { value: string; className?: string; shouldAnimate: boolean }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });
    const count = useMotionValue(0);
    
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    
    useEffect(() => {
        // Reset to 0 when shouldAnimate becomes true (user scrolled back to top)
        if (shouldAnimate && !isInView) {
            count.set(0);
        }
    }, [shouldAnimate, isInView, count]);
    
    useEffect(() => {
        if (isInView && shouldAnimate) {
            // Animate when in view and shouldAnimate is true
            const controls = animate(count, numericValue, {
                duration: 2,
                ease: "easeOut"
            });
            
            return controls.stop;
        } else if (isInView && !shouldAnimate) {
            // Show full number immediately if we shouldn't animate
            count.set(numericValue);
        }
    }, [isInView, count, numericValue, shouldAnimate]);
    
    useEffect(() => {
        const unsubscribe = count.on('change', (latest) => {
            if (ref.current) {
                const formatted = Math.floor(latest);
                const prefix = value.match(/^[^0-9]*/)?.[0] || '';
                const suffix = value.match(/[^0-9]*$/)?.[0] || '';
                const middle = value.replace(/^[^0-9]*/, '').replace(/[0-9.]+/, '').replace(/[^0-9]*$/, '');
                
                ref.current.innerHTML = `${prefix}${formatted}${middle}${suffix}`;
            }
        });
        
        return unsubscribe;
    }, [count, value]);
    
    return (
        <motion.h1 
            ref={ref} 
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
        >
            {value}
        </motion.h1>
    );
}

export default function InteractiveBlock() {
    const sectionRef = useRef<HTMLElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const { scrollY } = useScroll();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });
    
    // Detect desktop breakpoint (lg: 1024px)
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);
    
    // Create parallax transforms with different speeds for depth (only active on desktop)
    const y1 = useTransform(scrollYProgress, [0, 1], isDesktop ? [200, -200] : [0, 0]);
    const y2 = useTransform(scrollYProgress, [0, 1], isDesktop ? [300, -300] : [0, 0]);
    const y3 = useTransform(scrollYProgress, [0, 1], isDesktop ? [150, -150] : [0, 0]);
    const y4 = useTransform(scrollYProgress, [0, 1], isDesktop ? [250, -250] : [0, 0]);
    const y5 = useTransform(scrollYProgress, [0, 1], isDesktop ? [100, -100] : [0, 0]);
    const y6 = useTransform(scrollYProgress, [0, 1], isDesktop ? [280, -280] : [0, 0]);
    
    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            if (sectionRef.current) {
                const sectionTop = sectionRef.current.offsetTop;
                const sectionBottom = sectionTop + sectionRef.current.offsetHeight;
                
                // If user scrolls past the section, disable animation
                if (latest > sectionBottom) {
                    setShouldAnimate(false);
                }
                // If user scrolls back to top (within 100px), re-enable animation
                else if (latest < 100) {
                    setShouldAnimate(true);
                }
            }
        });
        
        return unsubscribe;
    }, [scrollY]);
    
    return (
        <section ref={sectionRef} className="interactive-block py-[100px] lg:py-[200px]">
            <div className="w-full mx-auto px-[2rem] md:px-[2rem] 2xl:px-[4rem]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="col-span-1 text-white text-[14px] md:text-[16px] fkt">
                        <motion.div style={{ y: y1 }} className="text-block-group">
                            <h1 className="text-[50px] md:text-[60px] lg:text-[80px] 2xl:text-[120px]">£1 billion</h1>
                            <motion.p 
                                className="2xl:max-w-[50%] mb-[100px] lg:mb-[300px]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                Our investors trust us with over £1 billion in assets under management.
                            </motion.p>
                        </motion.div>

                         <motion.div style={{ y: y2 }} className="text-block-group mb-[100px] lg:mt-[300px] lg:hidden">
                            <AnimatedHeading value="600k sq ft" className="text-[50px] md:text-[60px] lg:text-[80px] 2xl:text-[120px] buildup-number" shouldAnimate={shouldAnimate} />
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                Our investors trust us with over £1 billion in assets under management.
                            </motion.p>
                        </motion.div>

                        <motion.div style={{ y: y3 }} className="text-block-group lg:mt-[460px]">
                            <AnimatedHeading value="56 years" className="text-[50px] md:text-[60px] lg:text-[80px] 2xl:text-[120px] buildup-number" shouldAnimate={shouldAnimate} />
                            <motion.p 
                                className="2xl:max-w-[50%] mb-[100px] lg:mb-[300px]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                Our leadership team has a combined 56 years of experience delivering some of London's most iconic commercial spaces.
                            </motion.p>
                        </motion.div>

                        <motion.div style={{ y: y4 }} className="text-block-group">
                            <AnimatedNumber value="15" className="text-[24px] md:text-[28px] lg:text-[32px] 2xl:text-[50px] buildup-number" shouldAnimate={shouldAnimate} />
                            <motion.p 
                                className="2xl:max-w-[50%] mb-[100px] lg:mb-[300px]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                acquisitions across City and West End core locations
                            </motion.p>
                        </motion.div>

                        <motion.div style={{ y: y5 }} className="text-block-group">
                            <AnimatedNumber value="£33m" className="text-[24px] md:text-[28px] lg:text-[32px] 2xl:text-[50px] buildup-number" shouldAnimate={shouldAnimate} />
                            <motion.p 
                                className="2xl:max-w-[50%] mb-[100px] lg:mb-[300px]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                of contracted income
                            </motion.p>
                        </motion.div>

                        <motion.div style={{ y: y6 }} className="text-block-group">
                            <AnimatedNumber value="£47m" className="text-[24px] md:text-[28px] lg:text-[32px] 2xl:text-[50px] buildup-number" shouldAnimate={shouldAnimate} />
                            <motion.p 
                                className="2xl:max-w-[50%]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                ERV potential
                            </motion.p>
                        </motion.div>
                    </div>
                    
                    <div className="col-span-1 text-white text-[14px] md:text-[16px] fkt hidden lg:block">
                        <motion.div style={{ y: y2 }} className="text-block-group lg:mt-[300px] lg:mb-[150px] 2xl:mb-[200px]">
                            <AnimatedHeading value="600k sq ft" className="text-[50px] md:text-[60px] lg:text-[80px] 2xl:text-[120px] buildup-number" shouldAnimate={shouldAnimate} />
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.5 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                Our investors trust us with over £1 billion in assets under management.
                            </motion.p>
                        </motion.div>

                        <div className="scrolling-gallery-swiper">
                            
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
