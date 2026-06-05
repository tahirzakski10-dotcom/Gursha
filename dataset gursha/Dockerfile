# Multi-stage build for Ethiopian Food Recognition API
# ======================================================

# Stage 1: Builder
FROM python:3.10-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Create wheels for faster installation
RUN pip install --user --no-cache-dir --upgrade pip && \
    pip install --user --no-cache-dir wheel && \
    pip install --user --no-cache-dir -r requirements.txt


# Stage 2: Runtime
FROM python:3.10-slim

WORKDIR /app

# Install runtime system dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /root/.local /root/.local

# Set PATH for local packages
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Copy application files
COPY train.py predict_food.py app.py ./

# Create directories for model files and logs
RUN mkdir -p /app/checkpoints /app/logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Expose API port
EXPOSE 8000

# Default command (API server)
CMD ["python", "app.py"]
