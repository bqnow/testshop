# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- STAGE 2: Runner (Produktions-Image) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Wichtig für Docker Networking: Bindet den Server an 0.0.0.0 statt localhost.
# Dies stellt sicher, dass der Container von außen (z.B. durch Playwright) erreichbar ist.
ENV HOSTNAME="0.0.0.0"

# Sicherheit: Nicht als Root-User laufen lassen
# Wir erstellen einen spezifischen Benutzer/Gruppe mit ID 1001 für die Applikation
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiere nur öffentliche Assets (Bilder, Fonts, etc.)
COPY --from=builder /app/public ./public

# Kopiere den optimierten "Standalone" Build
# Diese Funktion (aktiviert in next.config.ts) erstellt einen minimalen Ordner
# mit nur den absolut notwendigen Dateien. Reduziert die Image-Größe um ca. 80%.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Wechsel zum Non-Root User
USER nextjs

EXPOSE 3000

# Starte den optimierten Server (server.js wird durch 'output: standalone' generiert)
CMD ["node", "server.js"]
