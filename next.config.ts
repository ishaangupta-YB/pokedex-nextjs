import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { 
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'api.microlink.io', 
        port: '',
        pathname: '/**', // Keep existing Microlink config
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/master/sprites/pokemon/**', // Allow PokeAPI sprites
      },
    ],
  },
};

export default nextConfig;
