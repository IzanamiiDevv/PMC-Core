@echo off
cls

set STEPS=7

echo ==========================================
echo       PMC BUILD SCRIPT STARTED
echo ==========================================
echo.

REM Step 1: Create the "dist" directory
echo [1/%STEPS%] Creating "dist" directory...
mkdir dist
if exist dist (
    echo "dist" directory ready.
) else (
    echo Error on creating "dist" directory.
    exit /b 1
)

call :loading

REM Step 2: Transpile TypeScript files using tsc
echo [2/%STEPS%] Compiling TypeScript using npx tsc...
start "" /wait cmd /c "npx tsc"
if %ERRORLEVEL% neq 0 (
    echo Error on compiling source code using "npx tsc".
    exit /b 1
)
call :loading

REM Step 3: Bundle into standalone executable using pkg
echo [3/%STEPS%] Creating executable using npx pkg...
copy /Y .\prototype\.env .\temp\.env >nul 2>&1
start "" /wait cmd /c "npx pkg ."
if %ERRORLEVEL% neq 0 (
    echo Error on creating executable using "npx pkg".
    exit /b 1
)
call :loading

REM Step 4: Copy the generated pmc.exe to the "dist" directory
echo [4/%STEPS%] Copying pmc.exe to "dist" directory...
copy /Y .\bin\pmc.exe .\dist\pmc.exe >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on copying pmc.exe to "dist" directory.
    exit /b 1
)
call :loading

REM Step 5: Copy the entire "prototype" folder into "dist"
echo [5/%STEPS%] Copying prototype directory into dist...
xcopy prototype dist /E /I /H /Y >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on copying prototype files into dist.
    exit /b 1
)
call :loading

REM Step 6: Compile Backend source code.
echo [6/%STEPS%] Compiling Server using "g++"...
powershell -Command "g++ server/main.cpp $(Get-ChildItem server/src -Filter '*.cpp' | ForEach-Object { $_.FullName }) -I./server/incl -o bin/pmc_server.exe -std=c++17 -lws2_32 -mwindows" > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on compiling backend server using "g++".
    exit /b 1
)
call :loading

REM Step 7: Copy the generated server.exe to the "dist" directory
echo [7/%STEPS%] Copying pmc_server.exe to "dist" directory...
copy /Y .\bin\pmc_server.exe .\dist\pmc_server.exe >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error on copying pmc_server.exe to "dist" directory.
    exit /b 1
)
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
