import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://miami-intel.com'),
  title: {
    default: 'MiamiIntel — AI Real Estate Intelligence Platform',
    template: '%s | MiamiIntel',
  },
  description:
    'Miami\'s most advanced AI-powered real estate platform. Analyze any property, get pre-approved, discover 6 investment strategies, and sell smarter. Powered by real-time market data.',
  keywords: [
    'Miami real estate',
    'Miami investment property',
    'Miami property analysis',
    'buy home Miami',
    'Miami rental income',
    'Miami Airbnb investment',
    'Miami house hack',
    'Miami BRRRR strategy',
    'Miami flip house',
    'pre-approval mortgage Miami',
    'Miami property value',
    'real estate AI',
    'Miami cap rate',
    'Miami cash flow analysis',
    'Miami zoning analysis',
  ],
  authors: [{ name: 'MiamiIntel', url: 'https://miami-intel.com' }],
  creator: 'MiamiIntel',
  publisher: 'MiamiIntel',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://miami-intel.com',
    siteName: 'MiamiIntel',
    title: 'MiamiIntel — AI Real Estate Intelligence Platform',
    description:
      'Analyze any Miami property in seconds. Investment strategies, pre-approval simulator, seller net sheet, and more. Powered by AI.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MiamiIntel — AI Real Estate Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiamiIntel — AI Real Estate Intelligence Platform',
    description:
      'Analyze any Miami property in seconds. Investment strategies, pre-approval, and seller tools. AI-powered.',
    images: ['/og-image.jpg'],
    creator: '@MiamiIntel',
  },
  alternates: {
    canonical: 'https://miami-intel.com',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // yandex: 'YOUR_YANDEX_CODE',
    // bing: 'YOUR_BING_CODE',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'MiamiIntel',
              description:
                'AI-powered real estate intelligence platform for Miami properties',
              url: 'https://miami-intel.com',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              provider: {
                '@type': 'Organization',
                name: 'MiamiIntel',
                url: 'https://miami-intel.com',
              },
            }),
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'var(--font-inter), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
