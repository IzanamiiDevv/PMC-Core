@echo off
cls

set STEPS=7
set STEP=1

echo ==========================================
echo       PMC BUILD SCRIPT STARTED
echo ==========================================
echo.


echo [PROJECT: %STEP%/%STEPS%]: Termanating Server process...
set /a STEP=STEP + 1
taskkill /IM pmc_server.exe /F

echo [PROJECT: %STEP%/%STEPS%]: Deleting "bin" directory...
set /a STEP=STEP + 1
rmdir /s /q "bin"

echo [PROJECT: %STEP%/%STEPS%]: Deleting "dist" directory...
set /a STEP=STEP + 1
rmdir /s /q "dist"

echo [PROJECT: %STEP%/%STEPS%]: Deleting "temp" directory...
set /a STEP=STEP + 1
rmdir /s /q "temp"


echo [PROJECT: %STEP%/%STEPS%]: Creating "dist" directory...
set /a STEP=STEP + 1
mkdir dist

echo [PROJECT: %STEP%/%STEPS%]: Creating "bin" directory...
set /a STEP=STEP + 1
mkdir bin

start "" cmd /c "build.app.bat"
start "" cmd /c "build.server.bat"


echo.
echo ==========================================
echo      BUILD COMPLETED SUCCESSFULLY!
echo ==========================================