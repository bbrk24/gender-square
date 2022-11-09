#!/bin/sh

cp index.html dist/index.html
cp gradient.png dist/gradient.png
cp cardinal-spline-js/*.js dist/cardinal-spline-js/
npx gh-pages -d dist
