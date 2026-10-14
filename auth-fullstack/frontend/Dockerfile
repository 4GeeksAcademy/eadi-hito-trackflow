FROM node:22-alpine

WORKDIR /workspace

COPY auth-fullstack/frontend/package.json auth-fullstack/frontend/package-lock.json ./auth-fullstack/frontend/
COPY uis/incident-manager/package.json uis/incident-manager/package-lock.json ./uis/incident-manager/

RUN npm ci --prefix /workspace/auth-fullstack/frontend --no-audit --no-fund \
    && npm ci --prefix /workspace/uis/incident-manager --no-audit --no-fund

COPY auth-fullstack/frontend ./auth-fullstack/frontend
COPY uis/incident-manager ./uis/incident-manager
COPY auth-fullstack/start.sh auth-fullstack/start.mjs ./auth-fullstack/

CMD ["sh", "/workspace/auth-fullstack/start.sh"]