FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Train models during build if missing
RUN python -m ml_service.training.train_models

EXPOSE 8000

CMD ["uvicorn", "ml_service.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
