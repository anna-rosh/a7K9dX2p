#!/bin/bash

# CouchDB Docker Container Cleanup Script
# This script destroys CouchDB content and kills the Docker container

set -e

echo "Starting CouchDB cleanup process..."

# Configuration
CONTAINER_NAME="couchdb"
COUCHDB_URL="http://localhost:5984"
COUCHDB_USER="admin"
COUCHDB_PASSWORD="password"
DATABASE_NAME="comments"

# Function to check if container is running
check_container() {
    if docker ps --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        return 0
    else
        return 1
    fi
}

# Function to delete database content
cleanup_database() {
    echo "Attempting to delete database content..."

    # Check if CouchDB is accessible
    if curl -f -s "${COUCHDB_URL}" > /dev/null 2>&1; then
        echo "CouchDB is accessible"

        # Delete the comments database
        echo "Deleting '${DATABASE_NAME}' database..."
        if curl -f -s -X DELETE \
            -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
            "${COUCHDB_URL}/${DATABASE_NAME}" > /dev/null 2>&1; then
            echo "Database '${DATABASE_NAME}' deleted successfully"
        else
            echo "Database '${DATABASE_NAME}' might not exist or already deleted"
        fi

        # List remaining databases
        echo "Remaining databases:"
        curl -s -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
            "${COUCHDB_URL}/_all_dbs" | jq . 2>/dev/null || echo "Could not fetch database list"
    else
        echo "WARNING: CouchDB is not accessible, skipping database cleanup"
    fi
}

# Function to stop and remove Docker container
cleanup_container() {
    echo "Managing Docker container..."

    if check_container; then
        echo "Container '${CONTAINER_NAME}' is running"

        # Stop the container
        echo "Stopping container '${CONTAINER_NAME}'..."
        docker stop "${CONTAINER_NAME}"
        echo "Container stopped"

        # Remove the container
        echo "Removing container '${CONTAINER_NAME}'..."
        docker rm "${CONTAINER_NAME}"
        echo "Container removed"
    else
        echo "Container '${CONTAINER_NAME}' is not running"

        # Check if container exists but is stopped
        if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
            echo "Removing stopped container '${CONTAINER_NAME}'..."
            docker rm "${CONTAINER_NAME}"
            echo "Stopped container removed"
        else
            echo "Container '${CONTAINER_NAME}' does not exist"
        fi
    fi
}

# Function to clean up volumes (optional)
cleanup_volumes() {
    echo "Checking for CouchDB volumes..."

    # First, ensure no containers are using CouchDB volumes
    echo "Checking for containers using CouchDB volumes..."
    containers_using_volumes=$(docker ps -a --filter "volume=local-first-comments-project_couchdb_data" --filter "volume=local-first-comments-project_couchdb_config" --format "{{.Names}}" || true)

    if [ -n "$containers_using_volumes" ]; then
        echo "WARNING: Found containers still using CouchDB volumes: $containers_using_volumes"
        echo "Removing these containers first..."
        echo "$containers_using_volumes" | while read -r container; do
            if [ -n "$container" ]; then
                echo "   Stopping and removing: $container"
                docker stop "$container" 2>/dev/null || true
                docker rm "$container" 2>/dev/null || true
            fi
        done
    fi

    # List volumes that might be related to CouchDB
    volumes=$(docker volume ls --format 'table {{.Name}}' | grep -i couchdb || true)

    if [ -n "$volumes" ]; then
        echo "Found CouchDB-related volumes:"
        echo "$volumes"

        read -p "Do you want to remove these volumes? (y/N): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "$volumes" | while read -r volume; do
                if [ -n "$volume" ]; then
                    echo "Removing volume: $volume"
                    if docker volume rm "$volume" 2>/dev/null; then
                        echo "Volume removed: $volume"
                    else
                        echo "WARNING: Could not remove volume: $volume (may still be in use)"
                        # Try to find what's still using it
                        echo "   Checking what might be using this volume..."
                        docker system df -v | grep "$volume" || true
                    fi
                fi
            done
        else
            echo "Skipping volume cleanup"
        fi
    else
        echo "No CouchDB-related volumes found"
    fi
}

# Main execution
main() {
    echo "========================================="
    echo "CouchDB Docker Cleanup Script"
    echo "========================================="

    cleanup_database
    echo

    cleanup_container
    echo

    cleanup_volumes
    echo

    echo "Cleanup completed!"
    echo
    echo "To restart CouchDB, run:"
    echo "   npm run docker:couchdb"
    echo "   npm run setup:couchdb"
}

main