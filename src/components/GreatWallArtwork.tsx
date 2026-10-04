import React from 'react';

interface Props {
  className?: string;
}

export const GreatWallArtwork: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden w-full select-none ${className}`}>
      {/* SVG Canvas depicting Great Wall, Mountain mist, Rising Golden Sun and Lanterns */}
      <svg
        viewBox="0 0 1200 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#180406" />
            <stop offset="45%" stopColor="#3d0c11" />
            <stop offset="75%" stopColor="#5c151c" />
            <stop offset="100%" stopColor="#150608" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#D97706" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#DC2626" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#450a0a" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#1f0305" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="mountainMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c080a" />
            <stop offset="100%" stopColor="#0f0203" />
          </linearGradient>

          <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c2410c" />
            <stop offset="50%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          <linearGradient id="goldLinework" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sky Background */}
        <rect width="1200" height="520" fill="url(#skyGrad)" />

        {/* Golden Sun on Horizon */}
        <circle cx="680" cy="220" r="160" fill="url(#sunGlow)" />
        <circle cx="680" cy="220" r="70" fill="#FEF08A" opacity="0.9" filter="url(#glow)" />

        {/* Chinese Traditional Cloud Patterns (祥云) */}
        <g stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.25" fill="none">
          <path d="M120 140 C140 120 170 120 190 140 C210 120 250 130 250 160 C250 180 230 190 200 190 L130 190 C100 190 90 170 100 150 C105 140 115 138 120 140 Z" />
          <path d="M150 165 C160 155 180 155 190 165" />
          <path d="M920 110 C940 90 970 90 990 110 C1010 90 1050 100 1050 130 C1050 150 1030 160 1000 160 L930 160 C900 160 890 140 900 120 C905 110 915 108 920 110 Z" />
        </g>

        {/* Distant Mountains Range */}
        <path
          d="M0 340 Q150 240 320 290 T640 250 T960 270 T1200 230 L1200 520 L0 520 Z"
          fill="url(#mountainFar)"
        />

        {/* Mid-ground Mountain Peaks with Ink Wash effect */}
        <path
          d="M-50 400 Q180 270 380 340 Q540 280 720 330 Q920 260 1150 340 L1250 520 L-50 520 Z"
          fill="url(#mountainMid)"
          opacity="0.95"
        />

        {/* Great Wall Winding Across Mountain Ridges */}
        {/* Wall Foundation & Steps */}
        <path
          d="M-20 460 
             C120 440, 220 390, 310 395 
             C400 400, 480 340, 580 350 
             C680 360, 770 300, 890 320 
             C1000 340, 1100 280, 1220 300 
             L1220 330 
             C1100 310, 1000 365, 890 345 
             C770 325, 680 385, 580 375 
             C480 365, 400 425, 310 420 
             C220 415, 120 465, -20 485 Z"
          fill="url(#wallGrad)"
          stroke="#F59E0B"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Great Wall Battlements / Parapets (Merlons) */}
        <path
          d="M20 450 l15 -2 v-8 h8 v8 l15 -2 v-8 h8 v8 l15 -3 v-8 h8 v8 l15 -4 v-8 h8 v8
             M140 428 l15 -3 v-8 h8 v8 l15 -4 v-8 h8 v8 l15 -5 v-8 h8 v8
             M240 404 l15 -2 v-8 h8 v8 l15 -2 v-8 h8 v8 l15 -1 v-8 h8 v8
             M340 395 l15 -10 v-7 h7 v7 l15 -10 v-7 h7 v7 l15 -10 v-7 h7 v7
             M440 355 l14 -3 v-7 h7 v7 l14 -3 v-7 h7 v7 l14 -3 v-7 h7 v7
             M620 355 l14 -10 v-6 h7 v6 l14 -10 v-6 h7 v6
             M720 325 l15 -6 v-6 h7 v6 l15 -6 v-6 h7 v6
             M820 310 l14 4 v-6 h7 v6 l14 4 v-6 h7 v6
             M950 325 l14 -10 v-6 h7 v6 l14 -10 v-6 h7 v6"
          stroke="#FDE68A"
          strokeWidth="1.8"
          strokeOpacity="0.75"
          fill="none"
        />

        {/* Watchtower 1 (Left Fore-Mid) */}
        <g transform="translate(290, 345)">
          {/* Main Tower Base */}
          <polygon points="0,55 55,55 50,0 5,0" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="1.2" />
          {/* Arched Gate Door */}
          <path d="M20,55 v-18 a7,7 0 0,1 15,0 v18 Z" fill="#180406" />
          {/* Slit Windows */}
          <rect x="12" y="15" width="5" height="10" rx="1" fill="#FEF08A" opacity="0.8" />
          <rect x="38" y="15" width="5" height="10" rx="1" fill="#FEF08A" opacity="0.8" />
          {/* Tower Top Platform & Chinese Eaves Roof */}
          <polygon points="-5,0 60,0 55,-12 0,-12" fill="#991b1b" stroke="#FDE68A" strokeWidth="1" />
          <path d="M-8,-12 Q27,-22 63,-12 L55,-8 Q27,-16 0,-8 Z" fill="#d97706" />
          {/* Little Spire */}
          <polygon points="25,-22 30,-28 35,-22" fill="#FDE68A" />
        </g>

        {/* Watchtower 2 (Center Summit) */}
        <g transform="translate(565, 305)">
          <polygon points="0,50 50,50 45,0 5,0" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="1" />
          <path d="M18,50 v-16 a6,6 0 0,1 14,0 v16 Z" fill="#180406" />
          <rect x="10" y="12" width="4" height="8" fill="#FEF08A" opacity="0.9" />
          <rect x="36" y="12" width="4" height="8" fill="#FEF08A" opacity="0.9" />
          <polygon points="-4,0 54,0 48,-10 2,-10" fill="#991b1b" stroke="#FDE68A" strokeWidth="1" />
          <path d="M-6,-10 Q25,-18 56,-10 L50,-7 Q25,-14 0,-7 Z" fill="#d97706" />
        </g>

        {/* Watchtower 3 (Distant Right) */}
        <g transform="translate(875, 275) scale(0.75)">
          <polygon points="0,50 45,50 40,0 5,0" fill="#581c87" opacity="0.6" stroke="#f59e0b" strokeWidth="0.8" />
          <path d="M16,50 v-14 a5,5 0 0,1 12,0 v14 Z" fill="#180406" />
          <polygon points="-3,0 48,0 43,-8 2,-8" fill="#7f1d1d" stroke="#FDE68A" strokeWidth="0.8" />
        </g>

        {/* Foreground Pine & Bamboo Silhouettes */}
        <g fill="#0b0304">
          {/* Left Bamboo/Pine */}
          <path d="M-10 520 Q40 440 20 380 Q70 410 80 520 Z" />
          <path d="M20 380 Q45 360 65 375 Q40 385 20 380 Z" />
          <path d="M22 395 Q60 385 85 400 Q50 405 22 395 Z" />
          <path d="M18 420 Q70 410 95 435 Q55 435 18 420 Z" />

          {/* Right Rocks & Pine */}
          <path d="M1210 520 Q1140 450 1170 390 Q1110 420 1100 520 Z" />
          <path d="M1170 390 Q1130 370 1100 385 Q1135 395 1170 390 Z" />
          <path d="M1160 410 Q1110 395 1080 415 Q1120 420 1160 410 Z" />
        </g>

        {/* Misty Atmospheric Glow in Valley */}
        <ellipse cx="600" cy="410" rx="450" ry="40" fill="#991b1b" opacity="0.2" filter="url(#glow)" />
        <ellipse cx="600" cy="450" rx="550" ry="30" fill="#f59e0b" opacity="0.12" filter="url(#glow)" />

        {/* Traditional Red Chinese Lanterns hanging from decorative gold branch */}
        <g transform="translate(90, 30)">
          {/* Lantern Cord */}
          <line x1="20" y1="0" x2="20" y2="45" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Lantern Body */}
          <ellipse cx="20" cy="70" rx="18" ry="25" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
          <ellipse cx="20" cy="70" rx="9" ry="25" fill="none" stroke="#FEF08A" strokeWidth="1" strokeOpacity="0.8" />
          {/* Top and Bottom Gold caps */}
          <rect x="11" y="45" width="18" height="5" rx="1" fill="#F59E0B" />
          <rect x="11" y="91" width="18" height="5" rx="1" fill="#F59E0B" />
          {/* Tassel */}
          <line x1="20" y1="96" x2="20" y2="125" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="20" cy="99" r="3" fill="#FEF08A" />
          {/* Soft Glow */}
          <circle cx="20" cy="70" r="32" fill="#DC2626" opacity="0.25" filter="url(#glow)" />
        </g>

        <g transform="translate(1100, 45)">
          <line x1="20" y1="0" x2="20" y2="40" stroke="#F59E0B" strokeWidth="1.5" />
          <ellipse cx="20" cy="62" rx="16" ry="22" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
          <ellipse cx="20" cy="62" rx="8" ry="22" fill="none" stroke="#FEF08A" strokeWidth="1" strokeOpacity="0.8" />
          <rect x="12" y="40" width="16" height="4" rx="1" fill="#F59E0B" />
          <rect x="12" y="80" width="16" height="4" rx="1" fill="#F59E0B" />
          <line x1="20" y1="84" x2="20" y2="110" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="20" cy="87" r="2.5" fill="#FEF08A" />
          <circle cx="20" cy="62" r="28" fill="#DC2626" opacity="0.25" filter="url(#glow)" />
        </g>

        {/* Traditional Chinese Red Seal Stamp (印章) in the corner: "学无止境" (Knowledge is infinite) */}
        <g transform="translate(1080, 420)">
          <rect x="0" y="0" width="60" height="60" rx="6" fill="#991b1b" stroke="#FEF08A" strokeWidth="1.5" />
          <text
            x="30"
            y="26"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="15"
            fontWeight="bold"
            fontFamily="'Noto Serif SC', serif"
          >
            学无
          </text>
          <text
            x="30"
            y="48"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="15"
            fontWeight="bold"
            fontFamily="'Noto Serif SC', serif"
          >
            止境
          </text>
        </g>
      </svg>
    </div>
  );
};
