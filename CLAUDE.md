# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AWS Lambda HTTP API using Serverless Framework v4, TypeScript, ESLint, Prettier, and Jest. Single GET `/` endpoint backed by Node.js 24 on Lambda via API Gateway v2.

## Commands

```bash
# Install dependencies
npm install

# Local development with hot reload (serverless-offline)
npm run dev   # http://localhost:3000

# Type check
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Tests
npm test
npm run test:watch

# Run a single test file
npx jest test/hello/hello.controller.test.ts

# Deploy to AWS (esbuild compiles TypeScript automatically)
serverless deploy --stage dev

# Remove deployed stack
serverless remove --stage dev
```

## Architecture

Each feature lives in `src/{feature}/` with three files:
- `{feature}.controller.ts` — Lambda handler, wires the event to the service and returns the HTTP response
- `{feature}.service.ts` — business logic, no AWS coupling
- `index.ts` — barrel re-export, used as the handler path in `config/functions.yml`

Tests mirror the source tree under `test/{feature}/`.

- **`config/functions.yml`** — all Lambda functions declared here; imported in `serverless.yml` via `${file(config/functions.yml)}`
- **`config/{stage}.yml`** — environment variables per stage (`dev`, `staging`, `prod`); loaded automatically by stage and exposed as `process.env` in handlers
- **`serverless.yml`** — org `gberdejo`, service `template-lambda-aws`, runtime `nodejs24.x`; esbuild is configured natively under `build.esbuild` (bundles, sourcemaps, externalizes `@aws-sdk/*`)
- **`eslint.config.js`** — ESLint 9 flat config with `typescript-eslint` + `eslint-config-prettier`
- **`.prettierrc`** — single quotes, 2-space indent, trailing commas, 100-char line width

## Key conventions

- All source files go under `src/`; test files go under `test/` mirroring the same structure
- Handler path format in `config/functions.yml`: `src/{feature}/index.{exportedName}`
- `@aws-sdk/*` is excluded from the esbuild bundle (available in the Lambda runtime)
- Prefix unused handler parameters with `_` (e.g. `_event`) to satisfy TypeScript strict mode
- Each function sets `disableLogs: true`; a custom CloudWatch log group (`INFREQUENT_ACCESS` class) is declared in `serverless.yml` resources instead
