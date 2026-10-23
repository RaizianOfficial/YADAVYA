"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface BrandStatementProps {
  text?: string;
}

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative inline-block mr-[0.25em] last:mr-0">
      <motion.span style={{ opacity }} className="text-ink">
        {children}
      </motion.span>
    </span>
  );
}

export function BrandStatement({ text }: BrandStatementProps) {
  const statement =
    text ||
    "YADAVYA exists in the quiet cadence between architectural precision and unadorned material. Every piece is an exercise in restraint—cut with calm discipline, tailored for longevity, and stripped of transient ornamentation.";

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = statement.split(" ");

  return (
    <section
      ref={containerRef}
      className="w-full py-16 sm:py-28 md:py-40 bg-surface border-hairline-t border-hairline-b my-10 sm:my-16"
    >
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-12 text-center space-y-6 sm:space-y-8">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink-soft block">
          The Philosophy
        </span>

        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight leading-[1.35] select-none">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} range={[start, end]} progress={scrollYProgress}>
                {word}
              </Word>
            );
          })}
        </p>

        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-ink-soft/70 block pt-2 sm:pt-4">
          YADAVYA Atelier • New Delhi
        </span>
      </div>
    </section>
  );
}
