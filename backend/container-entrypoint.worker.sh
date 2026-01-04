#!/usr/bin/env sh

# Wait for the django database
echo "Waiting for django database..."
while ! nc -z ${DJANGO_DB_HOST:=localhost} ${DJANGO_DB_PORT:=5432}; do
	sleep 0.1
done
echo "Django database started."

# Wait for the ALEX123 MySQL database
echo "Waiting for ALEX123 database..."
while ! nc -z "${ALEX123_DB_HOST:=localhost}" "${ALEX123_DB_PORT:=3306}"; do
	sleep 0.1
done
echo "ALEX123 database started."

python manage.py qcluster
