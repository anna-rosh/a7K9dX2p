#!/bin/bash

# CouchDB Docker Container Cleanup Script
# This script destroys CouchDB content and kills the Docker container

set -e

echo "🧹 Starting CouchDB cleanup process..."

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
    echo "📊 Attempting to delete database content..."

    # Check if CouchDB is accessible
    if curl -f -s "${COUCHDB_URL}" > /dev/null 2>&1; then
        echo "✓ CouchDB is accessible"

        # Delete the comments database
        echo "🗑️  Deleting '${DATABASE_NAME}' database..."
        if curl -f -s -X DELETE \
            -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
            "${COUCHDB_URL}/${DATABASE_NAME}" > /dev/null 2>&1; then
            echo "✓ Database '${DATABASE_NAME}' deleted successfully"
        else
            echo "ℹ️  Database '${DATABASE_NAME}' might not exist or already deleted"
        fi

        # List remaining databases
        echo "📋 Remaining databases:"
        curl -s -u "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
            "${COUCHDB_URL}/_all_dbs" | jq . 2>/dev/null || echo "Could not fetch database list"
    else
        echo "⚠️  CouchDB is not accessible, skipping database cleanup"
    fi
}

# Function to stop and remove Docker container
cleanup_container() {
    echo "🐳 Managing Docker container..."

    if check_container; then
        echo "✓ Container '${CONTAINER_NAME}' is running"

        # Stop the container
        echo "🛑 Stopping container '${CONTAINER_NAME}'..."
        docker stop "${CONTAINER_NAME}"
        echo "✓ Container stopped"

        # Remove the container
        echo "🗑️  Removing container '${CONTAINER_NAME}'..."
        docker rm "${CONTAINER_NAME}"
        echo "✓ Container removed"
    else
        echo "ℹ️  Container '${CONTAINER_NAME}' is not running"

        # Check if container exists but is stopped
        if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
            echo "🗑️  Removing stopped container '${CONTAINER_NAME}'..."
            docker rm "${CONTAINER_NAME}"
            echo "✓ Stopped container removed"
        else
            echo "ℹ️  Container '${CONTAINER_NAME}' does not exist"
        fi
    fi
}

# Function to clean up volumes (optional)
cleanup_volumes() {
    echo "💾 Checking for CouchDB volumes..."

    # List volumes that might be related to CouchDB
    volumes=$(docker volume ls --format 'table {{.Name}}' | grep -i couchdb || true)

    if [ -n "$volumes" ]; then
        echo "📦 Found CouchDB-related volumes:"
        echo "$volumes"

        read -p "❓ Do you want to remove these volumes? (y/N): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "$volumes" | while read -r volume; do
                if [ -n "$volume" ]; then
                    echo "🗑️  Removing volume: $volume"
                    docker volume rm "$volume" 2>/dev/null || echo "⚠️  Could not remove volume: $volume"
                fi
            done
        else
            echo "ℹ️  Skipping volume cleanup"
        fi
    else
        echo "ℹ️  No CouchDB-related volumes found"
    fi
}

# Main execution
main() {
    echo "========================================="
    echo "🧹 CouchDB Docker Cleanup Script"
    echo "========================================="

    # Step 1: Clean database content (if accessible)
    cleanup_database
    echo

    # Step 2: Stop and remove container
    cleanup_container
    echo

    # Step 3: Optional volume cleanup
    cleanup_volumes
    echo

    echo "✅ Cleanup completed!"
    echo
    echo "📝 To restart CouchDB, run:"
    echo "   npm run docker:couchdb"
    echo "   npm run setup:couchdb"
}

# Run main function
main