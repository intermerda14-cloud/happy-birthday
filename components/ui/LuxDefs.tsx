// components/ui/LuxDefs.tsx
// Filter SVG bersama: kulit sampul, kilau segel lilin, dan api lilin yang bergoyang.
export function LuxDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="lux-leather" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="4" result="n" />
          <feDiffuseLighting in="n" surfaceScale="1.8" lightingColor="#7a4a8a">
            <feDistantLight azimuth="225" elevation="50" />
          </feDiffuseLighting>
        </filter>

        <filter id="lux-wax" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence baseFrequency=".06" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="9" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.6" result="b" />
          <feSpecularLighting in="b" surfaceScale="5" specularConstant="1.1" specularExponent="24" lightingColor="#ffdede" result="s">
            <fePointLight x="30" y="14" z="70" />
          </feSpecularLighting>
          <feComposite in="s" in2="d" operator="in" result="s2" />
          <feComposite in="d" in2="s2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>

        <filter id="lux-flame" x="-40%" y="-30%" width="180%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".03 .08" numOctaves="1" seed="2" result="t">
            <animate attributeName="baseFrequency" dur="2.6s" values=".03 .08;.045 .11;.03 .08" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="6" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.3" />
        </filter>

        <symbol id="lux-seal" viewBox="0 0 120 120">
          <g filter="url(#lux-wax)">
            <circle cx="60" cy="60" r="46" fill="#7B1E3A" />
            <circle cx="60" cy="60" r="34" fill="none" stroke="#5E1229" strokeWidth="3" />
            <text x="60" y="76" textAnchor="middle" fontFamily="Georgia, serif" fontSize="44" fontWeight="600" fill="#93294A">A</text>
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
