Write-Host "🚀 Iniciando deploy para Cloudflare..."

# Step 1: Build
Write-Host "⚙️  Construindo aplicação..." -ForegroundColor Blue
try {
    npm run build:cloudflare
    Write-Host "✔️ Build concluído!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no build!" -ForegroundColor Red
    exit 1
}

Write-Host "\n# Step 2: Deploy (Worker publish SKIPPED)"
Write-Host "🔧 Publicação do Worker foi INTENCIONALMENTE PULADA nesta execução." -ForegroundColor Yellow
Write-Host "Se você quiser publicar o Worker manualmente, rode o wrangler publish ou restaure o passo removido." -ForegroundColor Yellow

# If you still want to deploy Pages artifacts, keep that logic below (example placeholder)
# Write-Host "\n# Step 3: Deploy Pages (opcional)"
# Write-Host "Publicando Pages..."
# wrangler pages publish ./public --project-name="<SEU_PROJECT_NAME>" --branch=fix/use-neon-only

Write-Host "\n✅ Processo de deploy (sem publicação do Worker) finalizado."