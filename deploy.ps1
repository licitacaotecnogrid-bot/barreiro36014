# Script de Deploy Cloudflare - Windows PowerShell
# Uso: .\deploy.ps1

Write-Host "🚀 Iniciando deploy para Cloudflare..." -ForegroundColor Green
Write-Host ""

# Step 1: Build
Write-Host "📦 Construindo aplicação..." -ForegroundColor Blue
npm run build:cloudflare
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build concluído!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy Worker (Backend)
Write-Host "🔧 Fazendo deploy do Worker (Backend)..." -ForegroundColor Blue
wrangler deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no deploy do Worker!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Worker deployado!" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy Pages (Frontend)
Write-Host "🎨 Fazendo deploy do Pages (Frontend)..." -ForegroundColor Blue
Write-Host "Aguarde... (este passo pode levar alguns minutos)" -ForegroundColor Yellow
wrangler pages deploy dist/spa --project-name barreiro360
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no deploy do Pages!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Pages deployado!" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Deploy completado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend:  https://barreiro360.pages.dev" -ForegroundColor Cyan
Write-Host "  Backend:   https://barreiro360-api.workers.dev" -ForegroundColor Cyan
Write-Host "  API:       https://barreiro360-api.workers.dev/api/" -ForegroundColor Cyan
Write-Host ""
