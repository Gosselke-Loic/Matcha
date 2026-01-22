# Provisoire, a changer.
NAME		=	matcha

RED 		=	\033[1;91m
YELLOW		=	\033[1;93m
GREEN		=	\033[1;92m
DEF_COLOR	=	\033[0;39m

all:	$(NAME)

$(NAME):
	@echo "$(GREEN) Starting production in detach $(DEF_COLOR)"
	@docker compose --profile prod up -d --build
	@echo "$(GREEN) Ready! $(DEF_COLOR)"

dev:
	@docker compose --profile dev up

.PHONY:			all dev

