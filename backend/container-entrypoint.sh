#!/usr/bin/env sh

# Wait for the database
echo "Waiting for postgres..."
while ! nc -z ${DJANGO_DB_HOST} ${DJANGO_DB_PORT}; do
	sleep 0.1
done
echo "PostgreSQL started"

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --no-input --clear

gunicorn lipidlibrarianweb.wsgi:application --bind 0.0.0.0:${BACKEND_PORT} --timeout 480 --workers 12 --user=root --group=root
