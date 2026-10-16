FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app/backend

# Build tools may be needed by some CatBoost/scientific Python wheels.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt gunicorn==23.0.0

# server.py loads CSV files and CatBoost models using paths relative to the
# working directory, so keep all four assets beside server.py.
COPY backend/server.py ./server.py
COPY backend/India-Agriculture-Crop-Production.csv ./
COPY backend/large_crop_price_dataset.csv ./
COPY backend/catboost_best.cbm ./
COPY backend/catboost_model.cbm ./

EXPOSE 5000

# One worker avoids loading the large datasets/models multiple times.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "4", "--timeout", "120", "server:app"]
