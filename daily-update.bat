@echo off
echo ===================================
echo   DAILY ANIME QUIZ UPDATER
echo ===================================
echo.

echo [1/3] Opening Prep Tool...
start prep-tool/index.html
timeout /t 2 /nobreak > nul

echo.
echo [2/3] Waiting for you to prepare images...
echo Press any key after downloading and extracting images to the images folder...
pause > nul

echo.
echo [3/3] Auto-updating quiz...
node update-quiz.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Node.js not found. Opening manual updater...
    start auto-update-quiz.html
    echo.
    echo Follow instructions in the browser window.
    pause
) else (
    echo.
    echo Opening quiz to test...
    start index.html
    
    echo.
    echo Test the quiz. If it works correctly:
    echo   Run: git add .
    echo   Run: git commit -m "Daily quiz update"
    echo   Run: git push
    echo.
)

pause
