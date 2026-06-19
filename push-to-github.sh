#!/bin/bash
cd "/c/Users/1/Desktop/Работа Клод/Финмодель Русь интерактив"
rm -f .git
git init
git add .
git commit -m "init"
git remote add origin https://github.com/ulysenko0-cmd/rusfinmod.git
git branch -M main
git push -u origin main
