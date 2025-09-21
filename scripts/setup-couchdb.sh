#!/bin/bash

# Wait for CouchDB to start
echo "Waiting for CouchDB to start..."
sleep 10

# Set base URL
COUCHDB_URL="http://admin:password@localhost:5984"

# Create the comments database
echo "Creating comments database..."
curl -X PUT "${COUCHDB_URL}/comments"

# Enable CORS for local development
echo "Enabling CORS..."
curl -X PUT "${COUCHDB_URL}/_node/nonode@nohost/_config/httpd/enable_cors" -d '"true"'
curl -X PUT "${COUCHDB_URL}/_node/nonode@nohost/_config/cors/origins" -d '"*"'
curl -X PUT "${COUCHDB_URL}/_node/nonode@nohost/_config/cors/credentials" -d '"true"'
curl -X PUT "${COUCHDB_URL}/_node/nonode@nohost/_config/cors/methods" -d '"GET, PUT, POST, HEAD, DELETE"'
curl -X PUT "${COUCHDB_URL}/_node/nonode@nohost/_config/cors/headers" -d '"accept, authorization, content-type, origin, referer, x-csrf-token"'

echo "CouchDB setup complete!"
echo "You can access CouchDB at: http://localhost:5984/_utils"
echo "Username: admin"
echo "Password: password"