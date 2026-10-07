/** Three Star Towers mark, redrawn as vector from the supplied logo (see /brand). */
export default function Logo({ className, light }: { className?: string; light?: boolean }) {
  // On dark backgrounds the brown towers flip to cream so the mark stays legible.
  const tower = light ? "#f6ecd8" : "#3d2820";
  const face = light ? "#8f7a5c" : "#ebe8e4";
  return (
    <svg className={className} viewBox="290 80 695 750" role="img" aria-label="Three Star Towers">
      <path d="M377 808A318 318 0 1 1 897 808" fill="none" stroke="#c9a646" strokeWidth="8" />
      <polygon points="670,97 793,215 793,480 710,532 710,243 670,218" fill="#c9a646" />
      <polygon points="710,532 793,480 793,810 710,810" fill={tower} />
      <polygon points="710,668 793,612 793,634 710,690" fill="#c9a646" />
      <polygon points="710,712 793,656 793,678 710,734" fill="#c9a646" />
      <polygon points="627,190 710,243 710,810 627,810" fill={face} />
      <g fill={tower}>
        <polygon points="643,232 700,268 700,282 643,246" />
        <polygon points="649,264 700,296 700,310 649,278" />
        <polygon points="655,296 700,324 700,338 655,310" />
        <polygon points="661,328 700,352 700,366 661,342" />
        <polygon points="667,360 700,380 700,394 667,374" />
        <polygon points="673,392 700,408 700,422 673,406" />
        <polygon points="679,424 700,436 700,450 679,438" />
        <polygon points="685,456 700,464 700,478 685,470" />
        <polygon points="527,268 627,190 627,810 592,810 592,486 527,428" />
        <polygon points="481,400 580,490 580,810 481,810" />
      </g>
      <g fill="#c9a646">
        {[0, 93, 180].map((dy) => (
          <path
            key={dy}
            transform={`translate(0 ${dy})`}
            d="M528 517l7.6 17.5 19 1.800-14.300 12.600 4.200 18.600-16.500-9.700-16.500 9.700 4.200-18.600-14.300-12.600 19-1.800z"
          />
        ))}
      </g>
    </svg>
  );
}
