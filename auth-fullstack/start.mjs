import { spawn } from 'node:child_process';

const applications = [
	{ name: 'backoffice', cwd: '/workspace/auth-fullstack/frontend', port: '3000' },
	{ name: 'incident-manager', cwd: '/workspace/uis/incident-manager', port: '3001' },
];

const children = [];
let stopping = false;

function stop(signal = 'SIGTERM') {
	if (stopping) return;
	stopping = true;
	for (const child of children) child.kill(signal);
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

for (const application of applications) {
	const child = spawn(
		'npm',
		['run', 'dev', '--', '--hostname', '0.0.0.0', '--port', application.port],
		{ cwd: application.cwd, env: process.env, stdio: 'inherit' },
	);
	children.push(child);
	child.on('error', (error) => {
		console.error(`No se pudo iniciar ${application.name}:`, error);
		process.exitCode = 1;
		stop();
	});
	child.on('exit', (code) => {
		if (!stopping) {
			process.exitCode = code ?? 1;
			stop();
		}
	});
}