# SatViewer3D Bot - Windows タスクスケジューラ登録解除スクリプト

$TaskName = "SatViewer3D_X_Bot"

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
Write-Host "✅ タスク '$TaskName' の登録を解除しました。" -ForegroundColor Green
