# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Install Node.js and npm
# RUN apt-get update && apt-get install -y curl gnupg
# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
# RUN apt-get install -y nodejs

# # Install npm packages
# RUN npm install

# # Build React app
# RUN npm run build

# Run Django migrations
RUN python manage.py migrate

# Expose the port the app runs on
EXPOSE 8001

# Run Django server
CMD python manage.py runserver 0.0.0.0:8001
