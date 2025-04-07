@echo off
echo Starting Food App...

echo Installing backend dependencies...
cd backend
call npm install
start cmd /k "npm run dev"

echo Installing frontend dependencies...
cd ../zomato
call npm install
start cmd /k "ng serve"

echo App is starting...
echo Frontend will be available at http://localhost:4200
echo Backend will be available at http://localhost:5000 