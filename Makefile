NAME		=	matcha

RED 		=	\033[1;91m
YELLOW		=	\033[1;93m
GREEN		=	\033[1;92m
DEF_COLOR	=	\033[0;39m

all:	$(NAME)

$(NAME):
	@echo "$(GREEN) Starting production in detach $(DEF_COLOR)"
	@docker compose -f docker-compose-prod.yml up -d --build
	@echo "$(GREEN) Ready! $(DEF_COLOR)"

dev:
	@docker compose -f docker-compose-dev.yml up

.PHONY:	all dev
