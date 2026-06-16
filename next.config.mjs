/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/articles", destination: "/exclusivo", permanent: true },
      {
        source: "/articles/:slug",
        destination: "/exclusivo/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
