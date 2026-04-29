.PHONY: build dev up down rebuild logs api-logs db-logs migrate clean

# Local development: backend + db in containers, frontend via npm
build:
	docker compose up -d --build db api

dev:
	npm run dev

# Stop just the dev backend stack
stop:
	docker compose stop db api

# Production-like: full stack including Nginx-served frontend
up:
	docker compose up -d --build

down:
	docker compose down

rebuild:
	docker compose up -d --build --force-recreate

logs:
	docker compose logs -f

api-logs:
	docker compose logs -f api

db-logs:
	docker compose logs -f db

# Optional: explicit Alembic migration (tables are auto-created on API startup,
# but use this if you start versioning the schema with Alembic later)
migrate:
	docker compose exec api alembic upgrade head

# Wipe everything including the Postgres volume (destructive)
clean:
	docker compose down -v
