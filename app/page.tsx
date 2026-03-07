"use client";
import Lanyard from "@/app/components/Lanyard";
import RotatingText from "@/app/components/RotatingText";
import SplitText from "@/app/components/SplitText";
import BlurText from "@/app/components/BlurText";
import AnimatedContent from "@/app/components/AnimatedContent";
import FeaturedProjectsSection from "@/app/components/FeaturedProjectsSection";
import MagicBento from "@/app/components/MagicBento";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";
import LogoLoop from "@/app/components/LogoLoop";
import { hero } from "@/app/data/mockData";
import GSAPReveal from "@/app/components/GSAPReveal";
import ParallaxSection from "@/app/components/ParallaxSection";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};


export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="relative z-10 container mx-auto min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Mobile first layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-4 lg:gap-0">
          {/* Text Content */}
          <div className="col-span-1 lg:col-span-6 order-1">
            <div className="flex items-center justify-center lg:justify-start h-full pt-24 pb-12 lg:py-0">
              <div className="flex flex-col gap-3 sm:gap-4 text-center lg:text-left">
                <AnimatedContent
                  distance={150}
                  direction="horizontal"
                  reverse={false}
                  duration={1.2}
                  ease="bounce.out"
                  initialOpacity={0.2}
                  animateOpacity
                  scale={1.1}
                  threshold={0.2}
                  delay={0.3}
                >
                  <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                    <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                      {hero.greeting}
                    </h1>
                    <RotatingText
                      texts={hero.rotatingTexts}
                      mainClassName="px-2 sm:px-2 md:px-3 bg-[#d10000] text-white overflow-hidden py-0.5 sm:py-1 md:py-1 justify-center rounded-lg text-lg sm:text-xl md:text-2xl font-bold inline-flex transition-all"
                      staggerFrom="last"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 400,
                      }}
                      rotationInterval={2000}
                    />
                  </div>
                </AnimatedContent>
                <div className="flex flex-col items-center lg:items-start">
                  <SplitText
                    text={hero.name}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center lg:text-start text-white"
                    delay={50}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                  <SplitText
                    text={hero.role}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center lg:text-start text-[#d10000]"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                </div>
                <BlurText
                  text={hero.description}
                  delay={150}
                  animateBy="words"
                  direction="top"
                  onAnimationComplete={handleAnimationComplete}
                  className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 text-white/90 max-w-md mx-auto lg:mx-0"
                />
              </div>
            </div>
          </div>
          {/* Lanyard 3D - Desktop only with parallax */}
          <div className="hidden lg:block col-span-1 lg:col-span-6 order-2 lg:h-full">
            <ParallaxSection speed={-0.1}>
              <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
            </ParallaxSection>
          </div>
        </div>
      </div>
      
      {/* Logo Loop Section — Clip-path reveal */}
      <div>
        <GSAPReveal preset="clip-up" duration={1.2} start="top 90%">
          <div style={{ height: '150px', position: 'relative', overflow: 'hidden'}} className="sm:h-[180px] md:h-[200px]">
            <LogoLoop
              logos={techLogos}
              speed={120}
              direction="left"
              logoHeight={36}
              gap={30}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor="#000000"
              ariaLabel="Technology partners"
            />
          </div>
        </GSAPReveal>
        
        {/* MagicBento Section — Blur-in reveal */}
        <GSAPReveal preset="blur-in" duration={1.4} delay={0.1}>
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        </GSAPReveal>
        
        {/* Featured Projects Section — Skew parallax */}
        <ParallaxSection speed={0.08} className="relative">
          <GSAPReveal preset="skew-up" duration={1} start="top 80%">
            <FeaturedProjectsSection />
          </GSAPReveal>
        </ParallaxSection>
      </div>
    </div>
  );
}
