.PHONY: build dev check up down rebuild logs api-logs db-logs migrate clean newsletter-test newsletter-send newsletter-export newsletter-set-current newsletter-build newsletter-upload

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

# Build per-language email HTML for an issue from its block files:
#   make newsletter-build ID=newsletter-1
newsletter-build:
	@test -n "$(ID)" || { echo 'Usage: make newsletter-build ID=newsletter-1'; exit 1; }
	npm run newsletter:build-emails -- $(ID)

# Build + upload every translated language of an issue as its "current issue"
# (subject read from each language's block file). Requires ADMIN_API_KEY.
#   make newsletter-upload ID=newsletter-1
newsletter-upload: newsletter-build
	@test -n "$(ID)" || { echo 'Usage: make newsletter-upload ID=newsletter-1'; exit 1; }
	@ID="$(ID)" API_URL="$(API_URL)" python3 scripts/upload-newsletter-issues.py

# Store an issue as "current" for ONE language (auto-sent to new subscribers of
# that language) WITHOUT sending it. LANG defaults to en. Prefer newsletter-upload,
# which does every translated language at once.
#   make newsletter-set-current FILE=newsletters/build/newsletter-1/en.html SUBJECT="Subject" LANG=en
newsletter-set-current:
	@test -n "$(FILE)" && test -n "$(SUBJECT)" || { echo 'Usage: make newsletter-set-current FILE=... SUBJECT="..." [LANG=en]'; exit 1; }
	@FILE="$(FILE)" SUBJECT="$(SUBJECT)" NL_LANG="$(or $(LANG),en)" python3 -c "import json,os; print(json.dumps({'subject': os.environ['SUBJECT'], 'html': open(os.environ['FILE']).read(), 'language': os.environ['NL_LANG']}))" | \
	curl -sS -X POST "$(API_URL)/api/v1/admin/newsletter/current" -H "X-API-Key: $$ADMIN_API_KEY" -H "Content-Type: application/json" --data-binary @-
	@echo

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

# Send the uploaded issues to ALL active subscribers, each in THEIR language
# (English fallback). Upload the issue first with newsletter-upload.
#   make newsletter-send
# Or a REAL send (personal unsubscribe link) to only ONE active subscriber:
#   make newsletter-send ONLY=one@subscriber.com
newsletter-send:
	@ONLY="$(ONLY)" python3 -c "import json,os; o=os.environ.get('ONLY'); print(json.dumps({'only_email': o} if o else {}))" | \
	curl -sS -X POST "$(API_URL)/api/v1/admin/newsletter/send" -H "X-API-Key: $$ADMIN_API_KEY" -H "Content-Type: application/json" --data-binary @-
	@echo
