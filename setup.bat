@echo off
cls

echo ==========================================
echo        PMC SETUP SCRIPT STARTED
echo ==========================================
echo.

REM Step 1: Check for required tools
call :check_tool node "Node.js"
call :check_tool npm "NPM (Node Package Manager)"
call :check_tool g++ "G++ (C++ Compiler)"

echo All required tools are installed. Proceeding...
echo.

REM Step 2: Install Node.js dependencies
echo Installing dependencies with npm...
start "" /wait cmd /c "npm install"
if errorlevel 1 (
    echo Failed to install dependencies!
    pause
    exit /b
)

echo.
echo All dependencies installed successfully!
exit /b

REM Function to check if a tool exists
:check_tool
where %1 >nul 2>&1
if errorlevel 1 (
    echo %2 not found. Please install it before proceeding.
    pause
    exit /b
) else (
    echo %2 found.
)
exit /b
