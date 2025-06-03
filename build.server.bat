@echo off
title SERVER BUILD PROCESS
set STEPS=5
set STEP=1

echo [APPLICATION: %STEP%/%STEPS%]: Compiling Server using "g++"...
set /a STEP=STEP + 1
powershell -Command "g++ server/main.cpp $(Get-ChildItem server/src -Filter '*.cpp' | ForEach-Object { $_.FullName }) -I./server/incl -o bin/pmc_server.exe -std=c++17 -lws2_32 -mwindows" > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on compiling backend server using "g++".
    exit /b 1
)

echo [APPLICATION: %STEP%/%STEPS%]: Copying pmc_server.exe to "dist" directory...
set /a STEP=STEP + 1
copy /Y .\bin\pmc_server.exe .\dist\pmc_server.exe >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on copying pmc_server.exe to "dist" directory.
    exit /b 1
)