export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://miami-intel.com/sitemap.xml',
    host: 'https://miami-intel.com',
  };
}
