$ErrorActionPreference = 'Stop'
$projectUrl = 'https://sapphura-qlr1.vercel.app'

function Get-EnvValue([string]$path, [string]$key) {
  if (!(Test-Path $path)) { return $null }
  $line = Get-Content $path | Where-Object { $_ -match "^$key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  $value = $line.Substring($key.Length + 1).Trim()
  if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Substring(1, $value.Length - 2) }
  return $value
}

function Set-VercelEnv([string]$key, [string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return }
  npx vercel env rm $key production --yes *> $null
  $value | npx vercel env add $key production *> $null
  Write-Output "Set $key"
}

$envPath = '.env'

$jwtBytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($jwtBytes)
$jwtSecret = ([System.BitConverter]::ToString($jwtBytes) -replace '-', '').ToLower()

$payBytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($payBytes)
$paymentSecret = ([System.BitConverter]::ToString($payBytes) -replace '-', '').ToLower()

Set-VercelEnv 'JWT_SECRET' $jwtSecret
Set-VercelEnv 'PAYMENT_SESSION_SECRET' $paymentSecret
Set-VercelEnv 'ALLOW_ADMIN_REGISTRATION' 'false'
Set-VercelEnv 'NEXT_PUBLIC_APP_URL' $projectUrl
Set-VercelEnv 'NEXT_PUBLIC_SITE_URL' $projectUrl

$keysToSync = @(
  'CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET','CLOUDINARY_URL',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME','NEXT_PUBLIC_CLOUDINARY_API_KEY',
  'GMAIL_USER','GMAIL_APP_PASSWORD','ADMIN_EMAIL'
)

foreach ($k in $keysToSync) {
  $v = Get-EnvValue $envPath $k
  if ($v) { Set-VercelEnv $k $v }
}

$db = Get-EnvValue $envPath 'DATABASE_URL'
if ($db -and $db -notmatch 'localhost|127\.0\.0\.1') {
  Set-VercelEnv 'DATABASE_URL' $db
} else {
  Write-Output 'SKIP DATABASE_URL (local/localhost found). Please add a cloud Postgres URL in Vercel dashboard.'
}

Write-Output 'Done secure env sync.'
