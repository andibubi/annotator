set -x
rm ~/app.jar
rmdir ~/app.jar
mv ~/annotator-0.0.1-SNAPSHOT.jar ~/app.jar
docker compose down jhipster-app -v
export YOUTUBE_API_KEY=AIzaSyA1qmY1nkMvUVpGQ2sIRpzRBW-wYVmu-_U
docker compose -f docker-compose.yml -f docker-compose-server.yml up -d
