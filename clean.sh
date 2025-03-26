#!/bin/bash

echo "Cleaning project..."

rm -rf node_modules
rm -f package-lock.json
rm -rf dist

echo "Reinstalling dependencies..."
npm install

echo "Done!"
