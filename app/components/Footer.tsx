"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-dark-950 py-10 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold gradient-text font-montserrat mb-3 sm:mb-4">
              IrfanSyahputra
            </h3>
            <p className="text-dark-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Menyediakan solusi pengembangan web dan aplikasi modern dengan
              fokus pada desain yang elegan, performa tinggi, dan pengalaman
              pengguna yang optimal.
            </p>
            {/* Social media icons can be added here */}
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-dark-300 hover:text-white transition text-sm sm:text-base"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-dark-300 hover:text-white transition text-sm sm:text-base"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-dark-300 hover:text-white transition text-sm sm:text-base"
                >
                  Portofolio
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-dark-300 hover:text-white transition text-sm sm:text-base"
                >
                  Layanan
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-dark-300 hover:text-white transition text-sm sm:text-base"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-dark-300 hover:text-white transition text-sm sm:text-base"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Kontak</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center">
                <span className="text-dark-300 text-sm sm:text-base">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center">
                <span className="text-dark-300 text-sm sm:text-base break-all">kontak@irfansyahputra.com</span>
              </li>
              <li className="flex items-center">
                <span className="text-dark-300 text-sm sm:text-base">Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-dark-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark-400 text-xs sm:text-sm mb-4 md:mb-0 text-center md:text-left">
              &copy; {new Date().getFullYear()} IrfanSyahputra. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
