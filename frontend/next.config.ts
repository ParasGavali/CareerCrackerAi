const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https' as const, hostname: '**' }]
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
