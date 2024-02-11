# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install virtualenv
RUN pip install virtualenv

# Create a virtual environment
RUN virtualenv /venv

# Activate the virtual environment
ENV PATH="/venv/bin:$PATH"

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Run Django migrations
RUN python manage.py migrate

# Expose the port the app runs on
EXPOSE 8001

# Run Django server
CMD python manage.py runserver 0.0.0.0:8001
