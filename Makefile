.PHONY: build dev check up down rebuild logs api-logs db-logs migrate clean newsletter-test newsletter-send newsletter-export

# Local development: backend + db in containers, frontend via npm
build:
	docker compose up -d --build db api

dev:
	npm run dev

# Type-check + build the frontend. NOTE: `tsc --noEmit` is vacuous here
# (solution-style tsconfig) — `npm run build` is the only real check.
check:
	npm run build
	@echo "Type-check passed!"

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

# ── Newsletter ──────────────────────────────────────────────────────────────
# See newsletters/README.md. Requires ADMIN_API_KEY in the environment.
# API_URL defaults to the local dev API; set it to the production URL to send for real.
API_URL ?= http://localhost:8106

# Download all active subscribers as CSV (for manual sends, e.g. Gmail BCC):
#   make newsletter-export
newsletter-export:
	@curl -sS "$(API_URL)/api/v1/admin/newsletter/export" -H "X-API-Key: $$ADMIN_API_KEY" -o newsletter-subscribers.csv
	@echo "Saved to newsletter-subscribers.csv ($$(($$(wc -l < newsletter-subscribers.csv) - 1)) subscribers)"

# Send an issue to ONE test address only:
#   make newsletter-test FILE=newsletters/issue.html SUBJECT="Subject line" EMAIL=you@example.com
newsletter-test:
	@test -n "$(FILE)" && test -n "$(SUBJECT)" && test -n "$(EMAIL)" || { echo 'Usage: make newsletter-test FILE=newsletters/issue.html SUBJECT="Subject" EMAIL=you@example.com'; exit 1; }
	@FILE="$(FILE)" SUBJECT="$(SUBJECT)" EMAIL="$(EMAIL)" python3 -c "import json,os; print(json.dumps({'subject': os.environ['SUBJECT'], 'html': open(os.environ['FILE']).read(), 'test_email': os.environ['EMAIL']}))" | \
	curl -sS -X POST "$(API_URL)/api/v1/admin/newsletter/send" -H "X-API-Key: $$ADMIN_API_KEY" -H "Content-Type: application/json" --data-binary @-
	@echo

# Send an issue to ALL active subscribers:
#   make newsletter-send FILE=newsletters/issue.html SUBJECT="Subject line"
# Or a REAL send (personal unsubscribe link) to only ONE active subscriber:
#   make newsletter-send FILE=... SUBJECT="..." ONLY=one@subscriber.com
newsletter-send:
	@test -n "$(FILE)" && test -n "$(SUBJECT)" || { echo 'Usage: make newsletter-send FILE=newsletters/issue.html SUBJECT="Subject" [ONLY=one@subscriber.com]'; exit 1; }
	@FILE="$(FILE)" SUBJECT="$(SUBJECT)" ONLY="$(ONLY)" python3 -c "import json,os; d={'subject': os.environ['SUBJECT'], 'html': open(os.environ['FILE']).read()}; o=os.environ.get('ONLY'); d.update({'only_email': o} if o else {}); print(json.dumps(d))" | \
	curl -sS -X POST "$(API_URL)/api/v1/admin/newsletter/send" -H "X-API-Key: $$ADMIN_API_KEY" -H "Content-Type: application/json" --data-binary @-
	@echo
