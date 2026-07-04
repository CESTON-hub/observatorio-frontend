// Íconos de línea minimalistas (24x24, stroke=currentColor) para el sidebar.
type Props = { className?: string };
const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconHome = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9a1 1 0 0 0 1 1H17.5a1 1 0 0 0 1-1v-9" /></svg>
);
export const IconSearch = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const IconBarChart = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M5 20V10M12 20V4M19 20v-7" /></svg>
);
export const IconGrid = ({ className }: Props) => (
  <svg {...base} className={className}><rect x="4" y="4" width="7" height="7" rx="1.2" /><rect x="13" y="4" width="7" height="7" rx="1.2" /><rect x="4" y="13" width="7" height="7" rx="1.2" /><rect x="13" y="13" width="7" height="7" rx="1.2" /></svg>
);
export const IconMegaphone = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M3 10v4a1 1 0 0 0 1 1h2l9 4V5L6 9H4a1 1 0 0 0-1 1Z" /><path d="M15 9.5a3 3 0 0 1 0 5" /></svg>
);
export const IconBook = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21Z" /><path d="M4 5.5v15.5" /></svg>
);
export const IconStar = ({ className }: Props) => (
  <svg {...base} className={className}><path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7Z" /></svg>
);
export const IconBuilding = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M6 21V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17" /><path d="M14 10h4a1 1 0 0 1 1 1v10" /><path d="M9 8h1M9 12h1M9 16h1" /></svg>
);
export const IconShare = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="6" cy="12" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="m8 11 8-3.5M8 13l8 3.5" /></svg>
);
export const IconCalculator = ({ className }: Props) => (
  <svg {...base} className={className}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" /></svg>
);
export const IconCheckCircle = ({ className }: Props) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.2 2.2 4.8-5" /></svg>
);
export const IconSliders = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M21 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="17" cy="18" r="2" /></svg>
);
export const IconShield = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M12 3 5 6v6c0 4.2 3 7 7 9 4-2 7-4.8 7-9V6Z" /></svg>
);
export const IconChevronDown = ({ className }: Props) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
);
export const IconLogOut = ({ className }: Props) => (
  <svg {...base} className={className}><path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
);
export const IconMenu = ({ className }: Props) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconClose = ({ className }: Props) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
