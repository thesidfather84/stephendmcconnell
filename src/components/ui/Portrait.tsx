"use client";

import Image from "next/image";
import { useState } from "react";

export function Portrait({
  src,
  alt,
  size = 320,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-full border-4 border-white bg-mist shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      {errored ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mist to-mist-dark text-4xl font-bold text-medical">
          SM
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
