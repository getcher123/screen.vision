FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=80

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY api ./api

EXPOSE 80

CMD ["sh", "-c", "uvicorn api.index:app --host 0.0.0.0 --port ${PORT}"]
