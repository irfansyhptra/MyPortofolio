"use client";
import React from "react";
import { motion } from "framer-motion";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  return (
    <div className="w-full h-full overflow-hidden bg-transparent relative flex flex-col justify-center items-center [perspective:1000px] [transform-style:preserve-3d]">
      <motion.div
        initial={{ rotateX: 20, rotateZ: -10, y: -20, opacity: 0, scale: 0.75 }}
        animate={{ rotateX: 20, rotateZ: -10, y: -10, opacity: 1, scale: 0.75 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col gap-4 w-[200%] origin-center"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="overflow-hidden w-full flex flex-row">
          <motion.div
            className="flex flex-row gap-4 pr-4 shrink-0 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
          >
            {[...firstRow, ...firstRow].map((product, idx) => (
              <ProductCard product={product} key={`row1-${product.title}-${idx}`} />
            ))}
          </motion.div>
        </div>

        <div className="overflow-hidden w-full flex flex-row">
          <motion.div
            className="flex flex-row gap-4 pr-4 shrink-0 w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
          >
            {[...secondRow, ...secondRow].map((product, idx) => (
              <ProductCard product={product} key={`row2-${product.title}-${idx}`} />
            ))}
          </motion.div>
        </div>

        <div className="overflow-hidden w-full flex flex-row">
          <motion.div
            className="flex flex-row gap-4 pr-4 shrink-0 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
          >
            {[...thirdRow, ...thirdRow].map((product, idx) => (
              <ProductCard product={product} key={`row3-${product.title}-${idx}`} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        The Ultimate <br /> development studio
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        We build beautiful products with the latest technologies and frameworks.
        We are a team of passionate developers and designers that love to build
        amazing products.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
}) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        z: 10,
      }}
      className="h-24 w-36 sm:h-28 sm:w-44 relative shrink-0 rounded-xl overflow-hidden border border-cream-border bg-cream shadow-sm transition-shadow hover:shadow-md"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl "
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
