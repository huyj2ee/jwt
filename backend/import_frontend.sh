#!/bin/bash
cd ../frontend/
rm -r -f build/
npm install
npm run build
cd ../backend/
rm -r -f src/main/resources/static
mkdir src/main/resources/static
cp -r ../frontend/build/* src/main/resources/static
