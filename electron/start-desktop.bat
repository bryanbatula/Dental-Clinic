@echo off
echo Starting Clinic Management Desktop App...
echo.

REM Check if node_modules exists in electron folder
if not exist "node_modules" (
    echo Installing Electron dependencies...
    call npm install
    echo.
)

REM Check if main project dependencies exist
if not exist "../node_modules" (
    echo Installing main project dependencies...
    cd ..
    call npm install
    cd electron
    echo.
)

echo Starting desktop application...
call npm run electron

pause 