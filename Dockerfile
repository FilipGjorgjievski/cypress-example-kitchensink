# Start from Playwright's official image — it has Node.js + all browsers ready
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (for layer caching — so npm install is cached)
COPY package.json package-lock.json ./

# Remove the prepare script — Husky git hooks are not needed inside a container
RUN npm pkg delete scripts.prepare

# Clean install of dependencies
RUN npm ci

# Now copy the rest of the project files
COPY . .

# Default command: start the app, wait for it, then run tests
CMD ["npx", "playwright", "test"]

