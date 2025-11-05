.PHONY: help install dev build start test migrate rollback seed reset docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Start development server"
	@echo "  make build       - Build for production"
	@echo "  make start       - Start production server"
	@echo "  make test        - Run tests"
	@echo "  make migrate     - Run migrations"
	@echo "  make rollback    - Rollback last migration"
	@echo "  make seed        - Run seeds"
	@echo "  make reset       - Rollback, migrate, and seed"
	@echo "  make docker-up   - Start Docker services"
	@echo "  make docker-down - Stop Docker services"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

test:
	npm test

migrate:
	npm run migrate:latest

rollback:
	npm run migrate:rollback

seed:
	npm run seed:run

reset:
	npm run db:reset

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

