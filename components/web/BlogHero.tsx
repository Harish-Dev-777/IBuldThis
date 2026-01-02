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
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 bg-neutral-50/50 dark:bg-background"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div ref={decorationsRef} className="absolute inset-0 w-full h-full">
          <div className="hero-decoration absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="hero-decoration absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
      </div>

      <div className="container px-4 mx-auto text-center z-10 flex flex-col items-center max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary/80 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Blogging Platform
        </div>

        <h1
          ref={titleRef}
          className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground"
        >
          Insights & <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Creative Ideas
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light mb-10 leading-relaxed"
        >
          Explore the latest thoughts on technology, design, and the future of
          web development in a space built for creators.
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center"
        >
          <Link
            href="/blog"
            className={buttonVariants({
              size: "lg",
              className:
                "min-w-[180px] h-14 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105",
            })}
          >
            Start Reading
          </Link>
          <Link
            href="/create"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "min-w-[180px] h-14 text-lg font-semibold bg-background/50 backdrop-blur-md border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all hover:scale-105",
            })}
          >
            Create Blog
          </Link>
        </div>
      </div>

      {/* Decorative separate line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-20" />
    </div>
  );
};
