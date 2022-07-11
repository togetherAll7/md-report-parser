#!/bin/sh
npm run build
git commit -am "Save uncommited changes (WIP)"
cd ..
git branch --delete --force gh-pages
git checkout --orphan gh-pages
git add -f preview/dist
git commit -m "Rebuild GitHub pages"
git filter-branch -f --prune-empty --subdirectory-filter ./preview/dist && git push -f origin gh-pages && git checkout -
