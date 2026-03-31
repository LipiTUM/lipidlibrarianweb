#!/usr/bin/env bash
set -e

# Wait for the ALEX123 MySQL database
echo "Waiting for ALEX123 database..."
while ! nc -z "${ALEX123_DB_HOST:=localhost}" "${ALEX123_DB_PORT:=3306}"; do
	sleep 0.1
done
echo "ALEX123 database started."

# Wait for the django cache
echo "Waiting for django cache..."
while ! nc -z "${DJANGO_CACHE_HOST:=localhost}" "${DJANGO_CACHE_PORT:=6379}"; do
	sleep 0.1
done
echo "Django cache started."

# Wait for the django database
echo "Waiting for django database..."
while ! nc -z ${DJANGO_DB_HOST:=localhost} ${DJANGO_DB_PORT:=5432}; do
	sleep 0.1
done
echo "Django database started."

# Default value
ROLE="${1:-backend}"

case "$ROLE" in
	backend)
		# Run the HDF5-to-MySQL ALEX123 database synchronization script
		echo "Syncing ALEX123 database..."
		sync_alex123_sql_database --sql "mysql+pymysql://${ALEX123_DB_USER:=alex123}:${ALEX123_DB_PASSWORD:=foo}@${ALEX123_DB_HOST:=localhost}:${ALEX123_DB_PORT:=3306}/alex123"

		# django database migrations
		python manage.py makemigrations
		python manage.py migrate
		python manage.py collectstatic --no-input --clear
		
		# run the backend
		gunicorn lipidlibrarianweb.wsgi:application --bind 0.0.0.0:${BACKEND_PORT:=8001} --timeout 480 --workers 12 --user=root --group=root
		;;
	worker)
		# wait until the ALEX123 database is ready
		echo "Waiting for ALEX123 database to accept queries..."
		until mysql -h "${ALEX123_DB_HOST:=localhost}" -P "${ALEX123_DB_PORT:=3306}" \
			-u "${ALEX123_DB_USER:=alex123}" -p"${ALEX123_DB_PASSWORD:=alex123}" \
			-e "SELECT 1;" "${ALEX123_DB_NAME:=alex123}" &>/dev/null; do
			sleep 0.5
		done
		echo "ALEX123 database ready."

		# run a worker
		python manage.py qcluster
		;;
	*)
		echo "Error: invalid argument '$ROLE'. Allowed values are 'backend' or 'worker'." >&2
		exit 1
	;;
esac
