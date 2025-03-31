#!/bin/bash
cd ../frontend/
rm -r -f build/
npm run build
cd ../backend/
rm -r -f src/main/resources/static
mkdir src/main/resources/static
cp ../frontend/build/* src/main/resources/static
