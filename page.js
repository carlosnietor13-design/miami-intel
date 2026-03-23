import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled — the portal uses browser APIs
const MiamiIntelPortal = dynamic(
  () => import('../components/MiamiIntelPortal'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2027 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          background: 'linear-gradient(135deg, #10b981, #3b82f6)',
          borderRadius: 12,
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'sans-serif' }}>
          Loading MiamiIntel…
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.95); }
          }
        `}</style>
      </div>
    ),
  }
);

export const metadata = {
  title: 'MiamiIntel — AI Real Estate Intelligence Platform',
  description:
    'Miami\'s most advanced AI-powered real estate platform. Analyze any property in seconds, get pre-approved, explore 6 investment strategies (Buy & Hold, Flip, BRRRR, House Hack, Value Add, Airbnb), and get your home\'s value with a full seller net sheet.',
  openGraph: {
    title: 'MiamiIntel — AI Real Estate Intelligence',
    description:
      'AI-powered property analysis, investment strategy simulator, pre-approval calculator, and seller tools for the Miami real estate market.',
    url: 'https://miami-intel.com',
  },
};

export default function HomePage() {
  return (
    <main>
      <MiamiIntelPortal />
    </main>
  );
}
