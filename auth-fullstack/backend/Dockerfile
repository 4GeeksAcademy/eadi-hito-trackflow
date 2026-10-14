FROM python:3.14-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY requirements.txt ./requirements.txt
RUN uv pip install --system -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]