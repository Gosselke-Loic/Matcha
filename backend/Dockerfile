# pull official base image
FROM python:3.11.3-slim-buster

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY . /usr/src/app/

# Ensure Flask app can be run; manage.py provides CLI
ENV FLASK_APP=project/__init__.py
ENV FLASK_RUN_HOST=0.0.0.0
# container exposes 5000 (compose maps 5001:5000)
EXPOSE 5000

CMD ["python", "manage.py", "run", "--host", "0.0.0.0"]