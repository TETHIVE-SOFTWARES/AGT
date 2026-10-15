/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    // Every asset in /public is already pre-sized and encoded to WebP by the
    // asset pipeline, so Next's on-demand optimiser has nothing left to do —
    // and on a cold cache it was queueing ~50 resize jobs on first load, which
    // is exactly why images arrived late. Serving them straight from /public
    // makes them appear immediately.
    unoptimized: true,
    // When the backend returns uploaded event photos from its own host,
    // uncomment and set the hostname:
    // remotePatterns: [{ protocol: "https", hostname: "cdn.example.com" }],
  },
};
export default nextConfig;
