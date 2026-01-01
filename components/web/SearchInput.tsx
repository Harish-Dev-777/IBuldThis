"use client";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export const SearchInput = () => {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { limit: 5, term: term } : "skip"
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true);
  }

  function handleInputFocus() {
    setOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Posts..."
          className="pl-8 w-full bg-background"
          value={term}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </div>
      {open && term.length >= 2 && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 z-50 overflow-hidden">
          {results === undefined ? (
            <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found
            </div>
          ) : (
            <div className="flex flex-col">
              {results.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post._id}`}
                  className="px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm transition-colors truncate"
                  onClick={() => setOpen(false)}
                >
                  <p className="font-medium truncate"> {post.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {post.body.substring(0, 60)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
