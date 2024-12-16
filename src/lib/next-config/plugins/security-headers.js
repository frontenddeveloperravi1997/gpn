const config = require('../../../temp/config');

/**
 * @param {import('next').NextConfig} nextConfig
 */
const SecurityHeadersPlugin = (nextConfig = {}) => {
  if (process.env.NODE_ENV !== 'development') {
    return Object.assign({}, nextConfig, {
      async headers() {
        const extendHeaders =
          typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];
        return [
          ...(await extendHeaders),
          {
            source: '/:path*', // Apply security headers to all paths
            headers: [
              {
                key: 'Referrer-Policy',
                value: process.env.REFERRER_POLICY || 'no-referrer',
              },
              {
                key: 'X-Frame-Options',
                value: process.env.X_FRAME_OPTIONS || 'SAMEORIGIN',
              },
              {
                key: 'X-Content-Type-Options',
                value: process.env.X_CONTENT_TYPE_OPTIONS || 'nosniff',
              },
              {
                key: 'Permissions-Policy',
                value:
                  process.env.PERMISSION_POLICY ||
                  'geolocation=(), microphone=(), camera=()',
              },
              {
                key: 'Content-Security-Policy',
                value:
                  process.env.CONTENT_SECURITY_POLICY ||
                  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self';",
              },
              {
                key: 'Strict-Transport-Security',
                value:
                  process.env.STRICT_TRANSPORT_SECURITY ||
                  'max-age=63072000; includeSubDomains; preload',
              },
            ],
          },
        ];
      },
    });
  }

  return nextConfig;
};

module.exports = SecurityHeadersPlugin;
