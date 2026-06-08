FROM python:3.11-slim

WORKDIR /app

# System dependencies install karein standard networking ke liye
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Requirements file register karein
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pura backend application code copy karein
COPY . .

EXPOSE 8000

# Server execution process trigger karein
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
