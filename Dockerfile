# pull official base image
FROM python:3.11.4-slim-buster
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt 
EXPOSE 8001
CMD ["python","manage.py","runserver","0.0.0.0:8001"]