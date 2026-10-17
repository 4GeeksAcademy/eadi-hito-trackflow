import type { NextConfig } from 'next';
import { backendUrl } from './lib/auth-session';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	distDir: process.env.TRACKFLOW_NEXT_DIST_DIR ?? '.next',
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
