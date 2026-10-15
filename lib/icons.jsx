/**
 * Line-art icon set, 24x24, stroked with currentColor.
 * Every path carries pathLength="1" so GSAP can draw them on with a single
 * strokeDashoffset tween regardless of the real path length.
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const P = (props) => <path pathLength="1" {...props} />;
const C = (props) => <circle pathLength="1" {...props} />;
const R = (props) => <rect pathLength="1" {...props} />;

const paths = {
  /* ---------- Products ---------- */
  cement: (
    <>
      <P d="M7 7.5h10l1.4 11.9a1 1 0 0 1-1 1.1H6.6a1 1 0 0 1-1-1.1L7 7.5Z" />
      <P d="M8.6 7.5V5.6a1 1 0 0 1 .6-.9l2.4-1a1 1 0 0 1 .8 0l2.4 1a1 1 0 0 1 .6.9v1.9" />
      <P d="M9.6 11.6h4.8" />
    </>
  ),
  tmt: (
    <>
      <P d="M7 3v18M12 3v18M17 3v18" />
      <P d="M5.7 6.6h2.6M10.7 6.6h2.6M15.7 6.6h2.6" />
      <P d="M5.7 10.4h2.6M10.7 10.4h2.6M15.7 10.4h2.6" />
      <P d="M5.7 14.2h2.6M10.7 14.2h2.6M15.7 14.2h2.6" />
      <P d="M5.7 18h2.6M10.7 18h2.6M15.7 18h2.6" />
    </>
  ),
  rings: (
    <>
      <R x="5.5" y="6" width="13" height="13" rx="1.2" />
      <P d="M16 6l2.6-2.2" />
      <P d="M18.4 8.6l2.2-1.9" />
    </>
  ),
  wire: (
    <>
      <P d="M6 6.5h9a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h9" />
      <P d="M6 6.5 8.2 4.3M18 18.5l-2.2 2.2" />
    </>
  ),
  msand: (
    <>
      <P d="M2.5 19.5h19" />
      <P d="M4.5 19.5 12 6.5l7.5 13" />
      <C cx="9.4" cy="16.4" r=".7" />
      <C cx="12.4" cy="13.2" r=".7" />
      <C cx="14.8" cy="17" r=".7" />
    </>
  ),
  psand: (
    <>
      <P d="M4 7h16l-2.4 10.6a1 1 0 0 1-1 .8H7.4a1 1 0 0 1-1-.8L4 7Z" />
      <P d="M6 11h12M7 15h10" />
      <P d="M9.4 7v11.4M14.6 7v11.4" />
    </>
  ),
  bricks: (
    <>
      <R x="3" y="6" width="18" height="4.4" rx=".6" />
      <R x="3" y="13.6" width="18" height="4.4" rx=".6" />
      <P d="M9 6v4.4M15 6v4.4" />
      <P d="M6 13.6V18M12 13.6V18M18 13.6V18" />
    </>
  ),
  blocks: (
    <>
      <R x="3" y="7" width="18" height="10" rx="1" />
      <R x="6" y="10" width="4.4" height="4" rx=".5" />
      <R x="13.6" y="10" width="4.4" height="4" rx=".5" />
    </>
  ),
  paints: (
    <>
      <R x="3.5" y="4" width="13" height="5" rx="1" />
      <P d="M16.5 6.5h3a1 1 0 0 1 1 1v2.2a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-1 1v1.8" />
      <R x="10.4" y="14" width="3.2" height="6" rx="1" />
    </>
  ),
  waterproof: (
    <>
      <P d="M12 2.8s5.6 6.2 5.6 9.8A5.6 5.6 0 0 1 12 18.2a5.6 5.6 0 0 1-5.6-5.6C6.4 9 12 2.8 12 2.8Z" />
      <P d="M9.4 12.6l1.9 1.9 3.5-3.7" />
    </>
  ),
  doors: (
    <>
      <R x="5" y="3" width="14" height="18" rx="1" />
      <R x="8" y="6" width="8" height="5" rx=".5" />
      <R x="8" y="13.4" width="8" height="5" rx=".5" />
      <C cx="6.6" cy="12" r=".7" />
    </>
  ),
  bitu: (
    <>
      <P d="M4 16.5c2.2-3 4.2-3 6.2 0s4 3 6.2 0 3.6-3 5.6 0" />
      <P d="M3.5 16.5V19h17v-2.5" />
      <P d="M8 8.5h8" />
      <P d="M12 4.5v4" />
    </>
  ),
  compound: (
    <>
      <P d="M7 8h10l1.2 11.2a1 1 0 0 1-1 1.1H6.8a1 1 0 0 1-1-1.1L7 8Z" />
      <P d="M8.2 8 12 4.6 15.8 8" />
      <C cx="12" cy="13.2" r="1.6" />
    </>
  ),
  weather: (
    <>
      <P d="M7 15.5h10.2a3.2 3.2 0 0 0 .4-6.4 4.2 4.2 0 0 0-8.1-1.2A3 3 0 0 0 7 15.5Z" />
      <P d="M9 18.2v1.6M12 18.2v1.6M15 18.2v1.6" />
    </>
  ),
  sealdry: (
    <>
      <R x="7" y="7" width="10" height="13" rx="1.4" />
      <P d="M9.2 7V5.4h5.6V7" />
      <P d="M9.4 12.2h5.2" />
    </>
  ),
  hiflex: (
    <>
      <R x="3.2" y="8" width="7.2" height="10" rx="1" />
      <R x="13.6" y="8" width="7.2" height="10" rx="1" />
      <P d="M6.8 8V5.6M17.2 8V5.6" />
      <P d="M10.4 13h3.2" />
    </>
  ),
  tile: (
    <>
      <R x="3.5" y="3.5" width="7.4" height="7.4" rx=".6" />
      <R x="13.1" y="3.5" width="7.4" height="7.4" rx=".6" />
      <R x="3.5" y="13.1" width="7.4" height="7.4" rx=".6" />
      <R x="13.1" y="13.1" width="7.4" height="7.4" rx=".6" />
    </>
  ),
  window: (
    <>
      <R x="5" y="3" width="14" height="18" rx="1" />
      <P d="M12 3v18M5 12h14" />
    </>
  ),
  gate: (
    <>
      <P d="M4 4.5v15M20 4.5v15" />
      <P d="M4 6.5h16M4 17.5h16" />
      <P d="M8 6.5v11M12 6.5v11M16 6.5v11" />
    </>
  ),
  hardware: (
    <>
      <R x="3.5" y="4" width="7" height="16" rx="1" />
      <R x="13.5" y="4" width="7" height="16" rx="1" />
      <P d="M10.5 6.8h3M10.5 12h3M10.5 17.2h3" />
      <C cx="7" cy="8" r=".7" />
      <C cx="7" cy="16" r=".7" />
      <C cx="17" cy="8" r=".7" />
      <C cx="17" cy="16" r=".7" />
    </>
  ),

  /* ---------- Benefits ---------- */
  price: (
    <>
      <P d="M20.4 12.6 12.6 20.4a2 2 0 0 1-2.8 0L3.6 14.2a2 2 0 0 1-.6-1.4V4.6a1 1 0 0 1 1-1h8.2a2 2 0 0 1 1.4.6l6.8 6.8a2 2 0 0 1 0 2.6Z" />
      <C cx="7.6" cy="7.6" r="1.3" />
    </>
  ),
  quality: (
    <>
      <P d="M12 2.8 14.5 4.7l3.1-.1 1 3 2.6 1.8-1 3 1 3-2.6 1.8-1 3-3.1-.1L12 21.2l-2.5-1.9-3.1.1-1-3-2.6-1.8 1-3-1-3 2.6-1.8 1-3 3.1.1L12 2.8Z" />
      <P d="M9 12.1l2.2 2.2L15.5 10" />
    </>
  ),
  genuine: (
    <>
      <P d="M12 2.8 4.6 5.9v6c0 4.4 3.1 8.3 7.4 9.3 4.3-1 7.4-4.9 7.4-9.3v-6L12 2.8Z" />
      <P d="M9.2 12.1l2 2 3.6-3.9" />
    </>
  ),

  /* ---------- Process ---------- */
  enquire: (
    <>
      <P d="M20 15.4a2 2 0 0 1-2 2H8.4L4 21V5.6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9.8Z" />
      <P d="M8.4 8.8h7.2M8.4 12.2h4.6" />
    </>
  ),
  quote: (
    <>
      <P d="M6 2.8h8l5 5v13.4H6a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" />
      <P d="M14 2.8v5h5" />
      <P d="M8.4 12h7M8.4 15.4h7M8.4 18.8h4" />
    </>
  ),
  dispatch: (
    <>
      <P d="M2.5 6.4h10v9.4h-10V6.4Z" />
      <P d="M12.5 9.4h4l3 3.1v3.3h-7V9.4Z" />
      <C cx="6.2" cy="17.6" r="1.8" />
      <C cx="16.4" cy="17.6" r="1.8" />
    </>
  ),
  delivered: (
    <>
      <P d="M12 21.2s7-5.7 7-11.2a7 7 0 1 0-14 0c0 5.5 7 11.2 7 11.2Z" />
      <C cx="12" cy="10" r="2.6" />
    </>
  ),
};

export default function Icon({ name, className = "", size = 24, ...rest }) {
  const content = paths[name];
  if (!content) return null;
  return (
    <svg
      {...base}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {content}
    </svg>
  );
}

export const iconNames = Object.keys(paths);
