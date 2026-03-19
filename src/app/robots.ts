import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard', '/reports/', '/settings'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://zipscope.com'}/sitemap.xml`,
  };
}
