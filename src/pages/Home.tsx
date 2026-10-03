import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import heroImg from '../assets/hero_img_1.png'
import { Activity, Cpu as Hardware, Cloud, Network, Rocket, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { useDeviceType } from '../hooks/useDeviceType'
import Background from '../components/Background'
import Header from '../components/Header'
import SplashScreen from '../components/SplashScreen'
import StickyFooter from '@/components/ui/footer'
import { Pricing } from '../components/blocks/Pricing'
import { Gallery4 } from '@/components/blocks/Gallery4'
import { ProposedSystem } from '@/components/blocks/ProposedSystem'
import { caseStudies } from '@/data/caseStudies'

// High-performance scroll section with zero scroll lag
const ScrollSection = ({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) => {
    return (
        <motion.div
            id={id}
            className={className}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '60px 24px',
                position: 'relative',
                transform: 'translateZ(0)',
            }}
        >
            {children}
        </motion.div>
    )
}

const StaggeredItem = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -40px 0px" }}
            transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
                delay,
            }}
            style={{ transform: 'translateZ(0)' }}
        >
            {children}
        </motion.div>
    )
}

const DarkTransition = () => {
    return (
        <div className="relative w-full h-[15vh] md:h-[25vh] -mb-[7vh] md:-mb-[12vh] z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        </div>
    )
}

const LightTransition = () => {
    return (
        <div className="relative w-full h-[15vh] md:h-[25vh] -mt-[7vh] md:-mt-[12vh] z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#f8fafc]" />
        </div>
    )
}

const Home = () => {
    const { isMobile } = useDeviceType()
    const navigate = useNavigate()
    const [showSplash, setShowSplash] = useState(true)
    const heroRef = useRef<HTMLImageElement>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const handleLoginTransition = () => {
        navigate('/login')
    }

    // Direct useScroll hook for hero fade without causing React component re-renders
    const { scrollY } = useScroll()
    const heroOpacity = useTransform(scrollY, [0, 350], [1, 0])
    const heroY = useTransform(scrollY, [0, 350], [0, 100])

    // Track scroll state with minimal renders
    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            const scrolled = latest > 100
            setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev))
        })

        return () => unsubscribe()
    }, [scrollY])

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth'
        return () => {
            document.documentElement.style.scrollBehavior = ''
        }
    }, [])

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        })
    }

    const applications = [
        { icon: <Activity size={24} style={{ color: '#8b5cf6' }} />, name: 'Healthcare', desc: 'Secure medical IoT devices and patient monitoring systems.' },
        { icon: <Hardware size={24} style={{ color: '#3b82f6' }} />, name: 'Industrial IoT', desc: 'Automation and factory monitoring with absolute security.' },
        { icon: <Network size={24} style={{ color: '#10b981' }} />, name: 'Smart City', desc: 'Infrastructure monitoring and public services connectivity.' },
        { icon: <Cloud size={24} style={{ color: '#f59e0b' }} />, name: 'Smart Home', desc: 'Secure appliance connectivity and energy management.' }
    ]

    return (
        <>
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            <Header visible={isScrolled} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05, transition: { duration: 0.5, ease: 'easeIn' } }}
                style={{ minHeight: '100vh', position: 'relative', background: '#f8fafc' }}
            >
                <style>
                    {`
                        ::-webkit-scrollbar { display: none; }
                        html { -ms-overflow-style: none; scrollbar-width: none; }
                        .glass-card {
                            background: rgba(255, 255, 255, 0.7);
                            backdrop-filter: blur(12px);
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            border-radius: 24px;
                            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
                        }
                    `}
                </style>

                <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                    <Background showGrid={false} />
                </div>

                {/* Hero Section */}
                <main style={{
                    position: 'relative', zIndex: 1, height: '100dvh', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', opacity: !showSplash ? 1 : 0, transition: 'opacity 0.8s', textAlign: 'center'
                }}>
                    <motion.div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: heroOpacity, y: heroY, willChange: 'transform, opacity' }}>
                        <img
                            ref={heroRef}
                            className={!showSplash ? "animate-hero-img" : ""}
                            src={heroImg}
                            alt="Hero"
                            draggable={false}
                            style={{
                                maxWidth: isMobile ? '85%' : '90%',
                                height: 'auto',
                                objectFit: 'contain',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                // @ts-ignore
                                WebkitUserDrag: 'none'
                            } as React.CSSProperties}
                        />
                    </motion.div>

                    <motion.h1
                        style={{
                            marginTop: isMobile ? '24px' : '48px',
                            fontSize: isMobile ? '42px' : '82px',
                            fontWeight: 900,
                            color: '#0f172a',
                            fontFamily: "'Space Grotesk', sans-serif",
                            letterSpacing: '-0.05em',
                            lineHeight: 0.9,
                            opacity: heroOpacity,
                            y: heroY,
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            willChange: 'transform, opacity'
                        }}
                    >
                        AuthSphere
                    </motion.h1>

                    <motion.p style={{
                        marginTop: '20px',
                        fontSize: isMobile ? '12px' : '14px',
                        fontWeight: 600,
                        letterSpacing: '0.3em',
                        color: '#6b7280',
                        display: 'flex',
                        gap: '10px',
                        opacity: heroOpacity,
                        y: heroY,
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        willChange: 'transform, opacity'
                    }}>
                        {!showSplash && (
                            <>
                                <span className="animate-word-1">NEURAL</span>
                                <span style={{ color: '#d1d5db' }}>|</span>
                                <span className="animate-word-2">SECURE</span>
                                <span style={{ color: '#d1d5db' }}>|</span>
                                <span className="animate-word-3">ABSOLUTE</span>
                            </>
                        )}
                    </motion.p>

                    <motion.div style={{ marginTop: '32px', opacity: heroOpacity, y: heroY, willChange: 'transform, opacity' }}>
                        <motion.button
                            onClick={handleLoginTransition}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                padding: isMobile ? '9px 22px' : '14px 40px',
                                fontSize: isMobile ? '13px' : '16px',
                                fontFamily: "'Kanit', sans-serif",
                                fontWeight: 600,
                                color: '#1e1b4b',
                                border: 'none',
                                borderRadius: '999px',
                                background: 'rgba(139, 92, 246, 0.08)',
                                boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                letterSpacing: '0.03em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <span>Discover AuthSphere</span>
                            <ArrowRight size={20} />
                        </motion.button>
                    </motion.div>



                    {!showSplash && (
                        <motion.div
                            style={{ position: 'absolute', bottom: '40px', left: '50%', x: '-50%', opacity: heroOpacity, transition: 'opacity 0.3s' }}
                            onClick={scrollToContent}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#94a3b8' }}>
                                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Scroll</span>
                                <div className="animate-bounce-arrow">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 13 12 18 17 13" /><polyline points="7 6 12 11 17 6" /></svg>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {!showSplash && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                bottom: '40px',
                                left: '48px',
                                right: '48px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontFamily: "'Kanit', sans-serif",
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#94a3b8',
                                opacity: heroOpacity,
                                transition: 'opacity 0.3s',
                                zIndex: 10
                            }}
                            className={isMobile ? 'hidden' : 'flex'}
                        >
                            <a href="/terms" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                                Terms and Conditions
                            </a>
                            <a href="/privacy" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                                Privacy and security rules
                            </a>
                        </motion.div>
                    )}
                </main>

                {/* Content Container with Narrative Flow */}
                <div style={{ position: 'relative', zIndex: 1 }}>

                    {/* 
                    <ScrollSection id="team" className="relative overflow-hidden">
                        // ... background ...
                        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            // ... content ...
                        </div>
                    </ScrollSection>
                    */}


                    {/* Problem Statement Section - Dedicated Scroll Reveal */}
                    <ScrollSection id="challenge">
                        <StaggeredItem delay={0.2}>
                            <div style={{
                                textAlign: 'left',
                                maxWidth: '1300px',
                                margin: '0 auto',
                                position: 'relative'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    gap: isMobile ? '20px' : '60px',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{ flex: '0 0 auto' }}>
                                        <h3 style={{
                                            fontSize: isMobile ? '32px' : '48px',
                                            fontWeight: 900,
                                            color: '#0f172a',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            maxWidth: '500px',
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.02em'
                                        }}>
                                            The Silent Vulnerability:<br />
                                            <span style={{ color: '#ef4444' }}>Why we built this.</span>
                                        </h3>
                                    </div>

                                    <div style={{
                                        flex: 1,
                                        paddingTop: isMobile ? '0' : '60px',
                                        borderLeft: isMobile ? 'none' : '2px solid rgba(239, 68, 68, 0.1)',
                                        paddingLeft: isMobile ? '0' : '40px'
                                    }}>
                                        <div style={{
                                            fontSize: '19px',
                                            color: '#64748b',
                                            lineHeight: 1.8,
                                            fontFamily: "'Kanit', sans-serif",
                                            fontWeight: 400
                                        }}>
                                            <p style={{ marginBottom: '20px' }}>
                                                As IoT devices saturate every layer of our critical infrastructure, we face a systemic <span style={{ color: '#0f172a', fontWeight: 600 }}>Trust Crisis</span>.
                                            </p>
                                            <p style={{ marginBottom: '20px' }}>
                                                Modern ecosystems rely on legacy identification methods that were never designed for the scale of billions of interconnected nodes. This <strong>'Identity Paradox'</strong> creates a lethal vulnerability: when a device cannot prove its own identity with absolute certainty, the entire network becomes an open target for <span style={{ color: '#ef4444', fontWeight: 500 }}>intercepted data streams</span> and <span style={{ color: '#ef4444', fontWeight: 500 }}>sophisticated spoofing attacks</span>.
                                            </p>
                                            <p style={{ margin: 0, fontStyle: 'italic', opacity: 0.8 }}>
                                                AuthSphere was born from the realization that in a zero-trust world, being 'connected' isn't enough you must be verifiable.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StaggeredItem>
                    </ScrollSection>

                    {/* Research & Groundwork Section */}
                    <ScrollSection>
                        <StaggeredItem delay={0.2}>
                            <div style={{
                                textAlign: 'right',
                                maxWidth: '1300px',
                                margin: '0 auto',
                                position: 'relative'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'row-reverse',
                                    gap: isMobile ? '20px' : '60px',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{ flex: '0 0 auto' }}>
                                        <h3 style={{
                                            fontSize: isMobile ? '32px' : '48px',
                                            fontWeight: 900,
                                            color: '#0f172a',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            maxWidth: '500px',
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.02em'
                                        }}>
                                            Research &<br />Groundwork:<br />
                                            <span style={{ color: '#3b82f6' }}>First Principles.</span>
                                        </h3>
                                    </div>

                                    <div style={{
                                        flex: 1,
                                        paddingTop: isMobile ? '0' : '60px',
                                        borderRight: isMobile ? 'none' : '2px solid rgba(59, 130, 246, 0.1)',
                                        paddingRight: isMobile ? '0' : '40px',
                                        textAlign: isMobile ? 'left' : 'right'
                                    }}>
                                        <div style={{
                                            fontSize: '19px',
                                            color: '#64748b',
                                            lineHeight: 1.8,
                                            fontFamily: "'Kanit', sans-serif",
                                            fontWeight: 400
                                        }}>
                                            <p style={{ marginBottom: '20px', textAlign: 'justify' }}>
                                                We didn't just patch existing holes. We performed a forensic <span style={{ color: '#0f172a', fontWeight: 600 }}>Decomposition</span> of the entire IoT communication stack.
                                            </p>
                                            <p style={{ marginBottom: '20px', textAlign: 'justify' }}>
                                                Our engineering process involved dissecting <strong>50+ CVEs</strong> to map legacy vulnerabilities and benchmarking <strong>next-gen cryptographic protocols</strong> on constrained hardware. This rigorous analysis allowed us to engineer a solution that balances <span style={{ color: '#3b82f6', fontWeight: 500 }}>military-grade encryption</span> with <span style={{ color: '#3b82f6', fontWeight: 500 }}>millisecond latency</span>.
                                            </p>
                                            <p style={{ margin: '0 0 40px 0', fontStyle: 'italic', opacity: 0.8, textAlign: 'justify' }}>
                                                Validated by 100% attack surface coverage in real-world simulations.
                                            </p>

                                            {/* Reference Cases - Vulnerability Archives */}
                                            <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '24px' }}>
                                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace" }}>
                                                // Reference_Cases: Vulnerability_Archive
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {[
                                                        { id: 'CVE-2016-10372', case: 'MIRAI BOTNET', desc: 'Exploited default credentials in 600k+ devices.' },
                                                        { id: 'CVE-2021-27346', case: 'VERKADA BREACH', desc: 'Root access to 150k live feeds via hardcoded secrets.' },
                                                        { id: 'CVE-2015-5364', case: 'JEEP HACK', desc: 'Remote execution of steering/brakes via cellular interface.' }
                                                    ].map((item, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '12px', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace" }}>
                                                            <span style={{ color: '#ef4444', fontWeight: 600 }}>{item.case}</span>
                                                            <span style={{ color: '#cbd5e1' }}>//</span>
                                                            <span style={{ color: '#64748b' }}>{item.desc}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StaggeredItem>
                    </ScrollSection>
                    <ScrollSection>
                        <Gallery4 items={caseStudies} />
                    </ScrollSection>

                    {/* Scroll-Triggered Smooth Dark Transition */}
                    <DarkTransition />

                    {/* "Docs" Section Link */}
                    <div id="docs" className="relative z-10">
                        <ProposedSystem />
                    </div>

                    {/* Scroll-Triggered Smooth Light Transition */}
                    <LightTransition />

                    <ScrollSection>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-20">
                                <StaggeredItem delay={0.1}>
                                    <h2 className="text-4xl md:text-5xl font-black font-space-grotesk text-slate-900 tracking-tight">
                                        Global Applications
                                    </h2>
                                </StaggeredItem>
                                <StaggeredItem delay={0.2}>
                                    <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
                                        Vertical solutions perfectly powered by AuthSphere infrastructure.
                                    </p>
                                </StaggeredItem>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {applications.map((app, i) => (
                                    <StaggeredItem key={i} delay={0.3 + i * 0.1}>
                                        <div className="group relative h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                            {/* Decorative Background Element */}
                                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0" />

                                            <div className="relative z-10">
                                                <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    {app.icon}
                                                </div>
                                                <h3 className="text-xl font-bold font-space-grotesk text-slate-900 mb-3">
                                                    {app.name}
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-sm">
                                                    {app.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </StaggeredItem>
                                ))}
                            </div>
                        </div>
                    </ScrollSection>

                    <ScrollSection>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-20 mt-10">
                                <StaggeredItem delay={0.1}>
                                    <h2 className="text-4xl md:text-5xl font-black font-space-grotesk text-slate-900 tracking-tight">
                                        Startup Vision
                                    </h2>
                                </StaggeredItem>
                                <StaggeredItem delay={0.2}>
                                    <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                                        Creating tremendous commercial value through lightweight, automated, and frictionless IoT security.
                                    </p>
                                </StaggeredItem>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                                {[
                                    { icon: <TrendingUp className="w-8 h-8 text-blue-600" />, title: 'Market Opportunity', desc: 'Secure solutions for SMEs and startups with limited security budgets.' },
                                    { icon: <Rocket className="w-8 h-8 text-indigo-600" />, title: 'Startup Potential', desc: 'Fully managed IoT security and zero-touch onboarding as a service.' },
                                    { icon: <Users className="w-8 h-8 text-emerald-600" />, title: 'Target Customers', desc: 'Industrial operators, smart city providers, and healthcare networks.' }
                                ].map((item, i) => (
                                    <StaggeredItem key={i} delay={0.3 + i * 0.1}>
                                        <div className="h-full bg-slate-50/50 backdrop-blur-sm rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 text-center group">
                                            <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                                                {item.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold font-space-grotesk text-slate-900 mb-4">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </StaggeredItem>
                                ))}
                            </div>
                        </div>
                    </ScrollSection>
                    <ScrollSection id="pricing">
                        <Pricing />
                    </ScrollSection>
                </div>

                <StickyFooter />
            </motion.div>
        </>
    )
}

export default Home
