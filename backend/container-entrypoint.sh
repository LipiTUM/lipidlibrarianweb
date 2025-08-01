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

# Run the HDF5-to-MySQL ALEX123 database synchronization script
echo "Syncing ALEX123 database..."
sync_alex123_sql_database --sql "mysql+pymysql://${ALEX123_DB_USER:=alex123}:${ALEX123_DB_PASSWORD:=foo}@${ALEX123_DB_HOST:=localhost}:${ALEX123_DB_PORT:=3306}/alex123"

# continue with django database migrations
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --no-input --clear

gunicorn lipidlibrarianweb.wsgi:application --bind 0.0.0.0:${BACKEND_PORT:=81} --timeout 480 --workers 12 --user=root --group=root
