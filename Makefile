RED 		=	\033[1;91m
YELLOW		=	\033[1;93m
GREEN		=	\033[1;92m
DEF_COLOR	=	\033[0;39m

DC_DEV = docker compose -f docker-compose-dev.yml
DC_PROD = docker compose -f docker-compose-prod.yml


prod:
	@echo "$(YELLOW) Starting production in detach $(DEF_COLOR)"
	@$(DC_DEV) up -d --build
	@echo "$(GREEN) Ready! $(DEF_COLOR)"


dev:
	@echo "$(YELLOW) Starting development environment $(DEF_COLOR)"
	@$(DC_DEV) up

dev-down:
	@$(DC_DEV) down

dev-down-v:
	@$(DC_DEV) down -v --remove-orphans

rebuild-dev:
	@$(DC_DEV) down -v && \
	$(DC_DEV) build --no-cache && \
	$(DC_DEV) up


prune:
	@docker system prune

prune-all:
	@docker system prune -a --volumes


.PHONY:	all dev dev-down dev-down rebuild-dev prod prune-all
