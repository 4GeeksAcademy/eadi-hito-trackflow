import type { NextConfig } from 'next';

const backendUrl = (process.env.BACKEND_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '');

const nextConfig: NextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: '/api/users/:path*',
				destination: `${backendUrl}/users/:path*`,
			},
			{
				source: '/api/suppliers/:path*',
				destination: `${backendUrl}/api/suppliers/:path*`,
			},
			{
				source: '/api/auth/:path*',
				destination: `${backendUrl}/auth/:path*`,
			},
			{
				source: '/api/incidents/:path*',
				destination: `${backendUrl}/api/incidents/:path*`,
			},
			{
				source: '/api/inventory/:path*',
				destination: `${backendUrl}/inventory/:path*`,
			},
		];
	},
};

export default nextConfig;
