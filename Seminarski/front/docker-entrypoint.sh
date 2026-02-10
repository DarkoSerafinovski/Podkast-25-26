#!/bin/sh

echo "Injecting environment variables into env.js"

sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /usr/share/nginx/html/env.js

sed -i "s|__SPOTIFY_CLIENT_ID__|${SPOTIFY_CLIENT_ID}|g" /usr/share/nginx/html/env.js

sed -i "s|__SPOTIFY_CLIENT_SECRET__|${SPOTIFY_CLIENT_SECRET}|g" /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"