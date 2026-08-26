FROM python:3.14-slim

COPY --from=ghcr.io/astral-sh/uv:0.12.6 /uv /uvx /usr/local/bin/

# Outside /app because compose bind-mounts the host repo over /app at run time,
# which would shadow a .venv built here.
ENV UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
