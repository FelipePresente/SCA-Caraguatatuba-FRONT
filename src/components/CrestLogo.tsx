import React from 'react';

interface CrestLogoProps {
  className?: string;
  size?: number;
}

export const CrestLogo: React.FC<CrestLogoProps> = ({ className = '', size = 120 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none drop-shadow-md ${className}`}
    >
      {/* Outer Blue Circle */}
      <circle cx="60" cy="60" r="54" fill="#2d6e9c" stroke="#ffffff" strokeWidth="3" />
      <circle cx="60" cy="60" r="48" fill="#1b527b" />

      {/* Mural Crown (Corona Muralis) on top */}
      <path
        d="M42 32H78L75 42H45L42 32Z"
        fill="#cca01b"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      {/* Crown battlements detail */}
      <path
        d="M42 32L45 27H49L47 32M53 32L55 27H59L57 32M63 32L65 27H69L67 32M73 32L75 27H79L77 32"
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="#e6b822"
      />

      {/* Anchor - Center symbol of Caraguatatuba coat of arms */}
      {/* Anchor Ring */}
      <circle cx="60" cy="48" r="5" stroke="#ffffff" strokeWidth="2.5" fill="none" />
      {/* Anchor Shank (Vertical shaft) */}
      <rect x="58.5" y="52" width="3" height="30" fill="#ffffff" rx="1.5" />
      {/* Anchor Stock (Horizontal bar) */}
      <rect x="50" y="55" width="20" height="2.5" fill="#ffffff" rx="1" />
      {/* Anchor Flukes (Curved arms at bottom) */}
      <path
        d="M44 72C48 83 72 83 76 72"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left Tip */}
      <path d="M42 70L46 73L43 76L42 70Z" fill="#ffffff" />
      {/* Right Tip */}
      <path d="M78 70L74 73L77 76L78 70Z" fill="#ffffff" />

      {/* Wave / Water lines at bottom of shield */}
      <path
        d="M25 88C35 84 45 92 60 88C75 84 85 92 95 88"
        stroke="#4180ab"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 95C32 91 42 99 60 95C78 91 88 99 100 95"
        stroke="#4180ab"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Outer Glow Ring */}
      <circle cx="60" cy="60" r="58" stroke="#4180ab" strokeWidth="1" opacity="0.3" />
    </svg>
  );
};

export default CrestLogo;
