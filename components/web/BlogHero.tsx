"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const BlogHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decorationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.8"
        )
        .fromTo(
          buttonsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.6"
        )
        .fromTo(
          ".hero-decoration",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.6,
            duration: 1.5,
            stagger: 0.2,
            ease: "elastic.out(1, 0.5)",
          },
          "-=1.2"
        );

      // Simple mouse parallax
      const handleMouseMove = (e: MouseEvent) => {
        if (!decorationsRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(decorationsRef.current, {
          x: x,
          y: y,
          duration: 1,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-x-hidden pt-32 pb-20"
    >
      {/* Background & Decorations */}
      <div className="absolute inset-0 -z-10 bg-background/50 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div ref={decorationsRef} className="absolute inset-0 w-full h-full">
          <div className="hero-decoration absolute top-[10%] left-[15%] w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="hero-decoration absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="hero-decoration absolute top-[40%] left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        </div>
      </div>

      <div className="container px-4 mx-auto text-center z-10 flex flex-col items-center">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-4 pb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
        >
          Insights & Ideas
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light mb-6"
        >
          Explore the latest thoughts on technology, design, and the future of
          web development.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <Link
            href="/blog"
            className={buttonVariants({
              size: "lg",
              className: "min-w-[160px] text-lg font-semibold",
            })}
          >
            View Blogs
          </Link>
          <Link
            href="/create"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "min-w-[160px] text-lg font-semibold bg-background/50 backdrop-blur-sm",
            })}
          >
            Create Blog
          </Link>
        </div>
      </div>

      {/* Decorative separate line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    </div>
  );
};
