FROM postgres:17

# Install pglogical extension and create config directory
RUN apt-get update && \
    apt-get install -y postgresql-17-pglogical && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /etc/postgresql && \
    chown postgres:postgres /etc/postgresql

# Set environment variables
ENV POSTGRES_DB=syncheddb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

# Copy guide file for manual setup
COPY guide.sql /docker-entrypoint-initdb.d/

# Copy configuration files
COPY postgresql.conf /etc/postgresql/
COPY pg_hba.conf /etc/postgresql/

# Expose PostgreSQL port
EXPOSE 5432

# Health check for production readiness
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

# Use the default entrypoint from nhost/postgres
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]