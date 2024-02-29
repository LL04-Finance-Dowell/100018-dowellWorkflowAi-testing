# pull official base image
FROM python:3.11.4-slim-buster

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# add a label
LABEL maintainer="wawinyedwin44@gmail.com"

# create and use a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# install dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip &&  pip install gunicorn && pip install --no-cache-dir -r requirements.txt

# copy project
COPY . .

# Expose the port on which the Django app will run
EXPOSE 8001

# Define the command to run the Django app using Gunicorn in production mode
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "wf_ai_core.wsgi:application"]
