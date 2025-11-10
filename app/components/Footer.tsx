"use client";

import Link from "next/link";
import { FaGithub, FaTwitter, FaGlobe, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-sm text-slate-600">
            © {currentYear} All rights reserved
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 justify-center">
            {/* Portfolio */}
            <Link
              href="https://www.rostyslav.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
            >
              <FaGlobe className="w-4 h-4" />
              <span>Portfolio</span>
            </Link>

            {/* 7-Day MVP Offer */}
            <Link
              href="https://rostyslavdzhohola.notion.site/Demo-Ready-MVP-in-7-Days-You-Own-the-Code-2a522202d9d4807b8afec810f3636b5e"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span>7-Day MVP</span>
            </Link>

            {/* Email */}
            <a
              href="mailto:rosty.build@gmail.com"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Email"
            >
              <FaEnvelope className="w-4 h-4" />
              <span>Contact</span>
            </a>

            {/* Social Media Links */}
            <Link
              href="https://x.com/dzhohola"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </Link>

            {/* GitHub */}
            <Link
              href="https://github.com/RostyslavDzhohola"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

