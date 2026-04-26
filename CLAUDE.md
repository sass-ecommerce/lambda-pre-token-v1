# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AWS Lambda HTTP API template using Serverless Framework v4, TypeScript, ESLint, and Prettier. Single GET `/` endpoint backed by Node.js 20 on Lambda via API Gateway v2.

## Commands

```bash
# Install dependencies
npm install

# Local development with hot reload (serverless-offline + esbuild watch)
npm run dev   # http://localhost:3000

# Type check
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Deploy to AWS (esbuild compiles TypeScript automatically)
serverless deploy

# Local development (Lambda emulator, live reload)
serverless dev

# Remove deployed stack
serverless remove
```

## Architecture

- **`src/handler.ts`** — Lambda handlers; use `APIGatewayProxyEventV2` / `APIGatewayProxyResultV2` types from `aws-lambda`
- **`serverless.yml`** — IaC config; org `gberdejo`, service `template-lambda-aws`, runtime `nodejs20.x`. Handler paths reference `src/` TypeScript files directly — `serverless-esbuild` compiles and bundles on deploy
- **`config/functions.yml`** — todas las funciones Lambda se declaran aquí; importado en `serverless.yml` via `${file(config/functions.yml)}`
- **`config/{stage}.yml`** — variables de entorno por stage (`dev`, `staging`, `prod`); cargado automáticamente según `--stage`. Todas las variables quedan disponibles en `process.env` dentro de los handlers
- **`eslint.config.js`** — ESLint 9 flat config with `typescript-eslint` + `eslint-config-prettier`
- **`.prettierrc`** — single quotes, 2-space indent, trailing commas, 100-char line width

## Key conventions

- All source files go under `src/`
- `@aws-sdk/*` is excluded from esbuild bundle (available in Lambda runtime)
- Prefix unused handler parameters with `_` (e.g. `_event`) to satisfy TypeScript strict mode
