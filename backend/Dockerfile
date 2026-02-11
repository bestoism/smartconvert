FROM python:3.11

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:${PATH}"

WORKDIR /app

COPY --chown=user:user requirements.txt .
# Pastikan requirements.txt sudah ada psycopg2-binary
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY --chown=user:user . .

# Port default HF Spaces adalah 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]