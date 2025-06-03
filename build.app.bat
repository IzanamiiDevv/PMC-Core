@echo off
title APPLICATION BUILD PROCESS
set STEPS=5
set STEP=1

echo [APPLICATION: %STEP%/%STEPS%]: Compiling TypeScript using npx tsc...
set /a STEP=STEP + 1
start "" /wait cmd /c "npx tsc"
if %ERRORLEVEL% neq 0 (
    echo Error on compiling source code using "npx tsc".
    exit /b 1
)

echo [APPLICATION: %STEP%/%STEPS%]: Creating executable using npx pkg...
set /a STEP=STEP + 1
copy /Y .\prototype\.env .\temp\.env >nul 2>&1
start "" /wait cmd /c "npx pkg ."
if %ERRORLEVEL% neq 0 (
    echo Error on creating executable using "npx pkg".
    exit /b 1
)

echo [APPLICATION: %STEP%/%STEPS%]: Copying pmc.exe to "dist" directory...
set /a STEP=STEP + 1
copy /Y .\bin\pmc_app.exe .\dist\pmc_app.exe >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on copying pmc_app.exe to "dist" directory.
    exit /b 1
)

echo [APPLICATION: %STEP%/%STEPS%]: Copying prototype directory into dist...
xcopy prototype dist /E /I /H /Y >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on copying prototype files into dist.
    exit /b 1
)