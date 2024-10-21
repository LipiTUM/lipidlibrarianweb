FROM python:3.10

# set environment variables
ARG LIPIDLIBRARIAN_GITHUB_COMMIT_REF

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL True

WORKDIR /app

# Install pipeline and container-entrypoint.sh dependencies
RUN apt-get update && apt-get install -y \
 netcat-openbsd \
 git

# Clone and Checkout LipidLibrarian
RUN git clone https://github.com/LipiTUM/lipidlibrarian.git /app/lipidlibrarian
WORKDIR /app/lipidlibrarian
RUN git checkout ${LIPIDLIBRARIAN_GITHUB_COMMIT_REF}

# Install virtual environment to /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN ln -sf /app/lipidlibrarian/venv /opt/venv

# Install LipidLibrarian
RUN make install

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
 pip install --no-cache-dir -r requirements.txt

# Bundle app source
COPY ./lipidlibrarianweb ./lipidlibrarianweb
COPY ./lipidlibrarianweb_api ./lipidlibrarianweb_api
COPY ./manage.py ./
COPY ./container-entrypoint.sh ./

# Prepare the start command
EXPOSE 8000
RUN chmod +x container-entrypoint.sh
ENTRYPOINT ["/app/container-entrypoint.sh"]
