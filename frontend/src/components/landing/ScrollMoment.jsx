import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const LINES = [
  { text: "Before the flowers.", strong: false },
  { text: "Before the celebration.", strong: false },
  { text: "They see the invitation.", strong: true },
];

const Line = ({ progress, range, strong, children, reduce }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [28, 0]);
  return (
    <motion.p
      style={reduce ? undefined : { opacity, y }}
      className={
        strong
          ? "font-serif italic text-espresso leading-[1] text-4xl sm:text-6xl lg:text-7xl"
          : "font-serif text-taupe/80 leading-tight text-2xl sm:text-3xl lg:text-4xl"
      }
    >
      {children}
    </motion.p>
  );
};

export const ScrollMoment = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  return (
    <section
      ref={ref}
      data-testid="scroll-moment"
      className="relative bg-ivory py-28 md:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          <Line progress={scrollYProgress} range={[0.05, 0.28]} reduce={reduce}>
            {LINES[0].text}
          </Line>
          <Line progress={scrollYProgress} range={[0.28, 0.5]} reduce={reduce}>
            {LINES[1].text}
          </Line>
          <Line progress={scrollYProgress} range={[0.5, 0.78]} strong reduce={reduce}>
            {LINES[2].text}
          </Line>
        </div>
      </div>
    </section>
  );
};
