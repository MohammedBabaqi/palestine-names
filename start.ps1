# Start both servers for the Palestine Names Archive project
Write-Host "Starting Palestine Names Archive..." -ForegroundColor Green

# Start FastAPI backend
Write-Host "[1/2] Starting FastAPI backend on http://localhost:8000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

Start-Sleep 2

# Start Next.js frontend
Write-Host "[2/2] Starting Next.js frontend on http://localhost:3000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers starting..." -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Green
