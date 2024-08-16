FROM python:3.8-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    default-libmysqlclient-dev \
    python3-dev \
    gcc \
    g++ \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip --default-timeout=400 install --no-cache-dir -r requirements.txt
# Copy the config.env file to the container
COPY config.env /app/config.env

# Export environment variables from config.env
RUN export $(cat /app/config.env | xargs)
RUN pip install pymysql

COPY . .

EXPOSE 5000

CMD ["python", "-u", "server.py"]