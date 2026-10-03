const Background = ({ showGrid = true }: { showGrid?: boolean }) => {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #faf9ff 0%, #f0eeff 25%, #ffffff 50%, #eef4ff 75%, #fdf2f8 100%)',
                zIndex: 0,
                contain: 'strict',
                transform: 'translateZ(0)',
                pointerEvents: 'none',
            }}
        >
            {/* Large ambient blobs - optimized blur */}
            <div
                className="animate-aurora-1"
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-15%',
                    width: '55%',
                    height: '65%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                    opacity: showGrid ? 1 : 0.4,
                    transform: 'translateZ(0)',
                }}
            />
            <div
                className="animate-aurora-2"
                style={{
                    position: 'absolute',
                    top: '20%',
                    right: '-20%',
                    width: '50%',
                    height: '60%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                    opacity: showGrid ? 1 : 0.4,
                    transform: 'translateZ(0)',
                }}
            />
            <div
                className="animate-aurora-3"
                style={{
                    position: 'absolute',
                    bottom: '-25%',
                    left: '30%',
                    width: '45%',
                    height: '55%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.07) 0%, rgba(244, 114, 182, 0.03) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                    opacity: showGrid ? 1 : 0.4,
                    transform: 'translateZ(0)',
                }}
            />

            {/* Accent orb — top-right warm */}
            <div
                className="animate-aurora-1"
                style={{
                    position: 'absolute',
                    top: '5%',
                    right: '10%',
                    width: '20%',
                    height: '25%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.06) 0%, transparent 70%)',
                    filter: 'blur(35px)',
                    opacity: showGrid ? 1 : 0.4,
                    transform: 'translateZ(0)',
                }}
            />

            {/* Refined grid — only rendered when showGrid is enabled */}
            {showGrid && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.12) 1px, transparent 1px)
              `,
                        backgroundSize: '80px 80px',
                        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)',
                        opacity: 0.12,
                        transform: 'translateZ(0)',
                    }}
                />
            )}

            {/* Floating particles — refined */}
            {[
                { top: '12%', left: '15%', size: 3, color: 'rgba(139, 92, 246, 0.25)', anim: 1 },
                { top: '25%', left: '80%', size: 2, color: 'rgba(99, 102, 241, 0.2)', anim: 2 },
                { top: '55%', left: '70%', size: 4, color: 'rgba(236, 72, 153, 0.15)', anim: 3 },
                { top: '70%', left: '20%', size: 2, color: 'rgba(59, 130, 246, 0.2)', anim: 1 },
                { top: '40%', left: '90%', size: 3, color: 'rgba(139, 92, 246, 0.18)', anim: 2 },
            ].map((p, i) => (
                <div
                    key={i}
                    className={`animate-float-${p.anim}`}
                    style={{
                        position: 'absolute',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        borderRadius: '50%',
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        top: p.top,
                        left: p.left,
                        transform: 'translateZ(0)',
                    }}
                />
            ))}
        </div>
    );
};

export default Background;
