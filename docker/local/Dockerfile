FROM python:3.14-slim

# Above the Python layers because it is the largest and least-changing: a pyproject.toml
# pin must not rebuild ~150MB of Node.
ARG NODE_VERSION=24.19.0
ARG NVM_VERSION=v0.40.7
ENV NVM_DIR=/usr/local/nvm

# curl is installed and purged inside one RUN so it never reaches a committed layer.
# a+rX because the build runs as root and the runtime does not.
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && mkdir -p $NVM_DIR \
 && curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh | bash \
 && . $NVM_DIR/nvm.sh && nvm install ${NODE_VERSION} \
 && ln -s $NVM_DIR/versions/node/v${NODE_VERSION}/bin/* /usr/local/bin/ \
 && chmod -R a+rX $NVM_DIR \
 && apt-get purge -y curl && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.12.6 /uv /uvx /usr/local/bin/

# Outside /app because compose bind-mounts the host repo over /app at run time,
# which would shadow a .venv built here.
ENV UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project

# Installing into /app/node_modules is what seeds the named volume on first creation.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

EXPOSE 8000 5173

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
