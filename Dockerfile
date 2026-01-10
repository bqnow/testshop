FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# 1. Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# 2. Copy source code
COPY . .

# 3. Build the Next.js app (Simulate Production/CI environment)
RUN npm run build

# 4. Define default command
# This runs the tests using the production build (because CI=true will be set)
CMD ["npm", "run", "test:e2e"]
