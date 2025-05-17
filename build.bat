@echo off
cls

set STEPS=6

echo ==========================================
echo       PMC BUILD SCRIPT STARTED
echo ==========================================
echo.

REM Step 1: Create the "dist" directory
echo [1/%STEPS%] Creating "dist" directory...
mkdir dist
call :loading

REM Step 2: Transpile TypeScript files using tsc
echo [2/%STEPS%] Compiling TypeScript using npx tsc...
start "" /wait cmd /c "npx tsc"
call :loading

REM Step 3: Bundle into standalone executable using pkg
echo [3/%STEPS%] Creating executable using npx pkg...
start "" /wait cmd /c "npx pkg ."
call :loading

REM Step 4: Copy the generated pmc.exe to the "dist" directory
echo [4/%STEPS%] Copying pmc.exe to "dist" directory...
copy /Y .\bin\pmc.exe .\dist\pmc.exe >nul 2>&1
call :loading

REM Step 5: Copy the entire "prototype" folder into "dist"
echo [5/%STEPS%] Copying prototype directory into dist...
xcopy prototype dist /E /I /H /Y >nul 2>&1
call :loading

echo.
echo ==========================================
echo      BUILD COMPLETED SUCCESSFULLY!
echo ==========================================
goto :eof

REM Loading animation
:loading
<nul set /p=Loading.
ping localhost -n 2 >nul
<nul set /p=.
ping localhost -n 2 >nul
<nul set /p=.
ping localhost -n 2 >nul
echo.
goto :eof
