# Use a smaller base image
FROM python:3.11.4-alpine

# Set work directory
WORKDIR /usr/src/app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Add a label
LABEL maintainer="wawinyedwin44@gmail.com"

# Create and use a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
COPY ./requirements.txt .
RUN /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir gunicorn && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose the port on which the Django app will run
EXPOSE 8001

# Define the command to run the Django app using Gunicorn in production mode
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "wf_ai_core.wsgi:application"]
