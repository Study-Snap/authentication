#!/bin/sh

echo "Waiting for environment secrets to be loaded"
while [[-z $DB_PASS ]]; do
  sleep(1);
done

echo "Building authentication service"
npm run build

echo "Running authentication service..."
npm run start
