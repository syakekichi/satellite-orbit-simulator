$TaskName = "SatViewer3D_X_Bot"
$VbsPath = "C:\Users\vanil\Documents\satellite-orbit-simulator\silent_run_bot.vbs"

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

$Action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$VbsPath`""
$Trigger = New-ScheduledTaskTrigger -Daily -At "00:00"
$Trigger.Repetition = (New-ScheduledTaskTrigger -Once -At "00:00" -RepetitionInterval (New-TimeSpan -Hours 2) -RepetitionDuration (New-TimeSpan -Days 3650)).Repetition
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "SatViewer3D Automated Satellite Tracker Bot for X (Silent Background Runner)"

Write-Host "Task Registered (Every 2 Hours, Silent Mode): $TaskName" -ForegroundColor Green
