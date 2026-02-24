FROM postgis/postgis:18-3.6

# Install pgvector
RUN apt-get update && \
    apt-get install -y postgresql-18-pgvector && \
    rm -rf /var/lib/apt/lists/*