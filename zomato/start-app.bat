@echo off
echo Starting Food App...

echo Starting Backend Server...
cd backend
start cmd /k "npm run dev"

echo Starting Frontend Server...
cd ../zomato
start cmd /k "ng serve"

echo App is starting...
echo Frontend will be available at http://localhost:4200
echo Backend will be available at http://localhost:5000 