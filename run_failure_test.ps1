param(
    [string]$OutputFile = "test-results/failover_before.txt"
)

Write-Host "Starting k6 load test in background..."
$k6Process = Start-Process -FilePath "tools/k6/k6-v2.3.0-windows-amd64/k6.exe" -ArgumentList "run load-tests/failover-test.js" -NoNewWindow -PassThru -RedirectStandardOutput $OutputFile

Start-Sleep -Seconds 1

Write-Host "Killing container scholarship-backend-2 abruptly midway through load test..."
docker kill scholarship-backend-2

Write-Host "Waiting for k6 process to finish..."
$k6Process.WaitForExit()

Write-Host "Load test finished. Results saved to $OutputFile"
Get-Content $OutputFile | Select-String "http_req_failed", "checks_succeeded", "checks_failed", "http_reqs"
