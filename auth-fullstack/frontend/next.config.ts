import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: '/api/users/:path*',
				destination: 'http://127.0.0.1:8000/users/:path*',
			},
			{
				source: '/api/suppliers/:path*',
				destination: 'http://127.0.0.1:8000/api/suppliers/:path*',
			},
			{
				source: '/api/auth/:path*',
				destination: 'http://127.0.0.1:8000/auth/:path*',
			},
		];
	},
};

export default nextConfig;
