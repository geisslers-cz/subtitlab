.PHONY: default
default: build

.PHONY: clean
clean:
	rm -rf build

node_modules:
	bun install --frozen-lockfile

.PHONY: lint
lint: node_modules
	bun x eslint .

.PHONY: style
style: node_modules
	bun x prettier --check .

.PHONY: typecheck
typecheck: node_modules
	bun x svelte-kit sync
	bun x svelte-check --tsconfig ./tsconfig.json

.PHONY: checks
checks: lint style typecheck

.PHONY: pretty
pretty: node_modules
	bun x eslint --fix .
	bun x prettier --write .

.PHONY: dev
dev: node_modules
	bun x vite dev

build: node_modules
	bun x svelte-kit sync
	bun x vite build

.PHONY: preview
preview: build
	bun x vite preview
