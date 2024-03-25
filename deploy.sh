echo "Pulling fra git"
git pull
echo "Bygger app"
docker compose -f docker-compose.yaml up
