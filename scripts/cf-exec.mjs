import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const secretsPath = path.resolve('Credentials/Secrets.txt')
const content = fs.readFileSync(secretsPath, 'utf8')

let apiToken = ''
let accountId = '337676b90c8603acfc4089c065674a50'

const lines = content.split('\n')
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim()
  if (line.includes('Your API Token') && i + 1 < lines.length) {
    apiToken = lines[i + 1].trim()
  } else if (line.startsWith('cfat_')) {
    apiToken = line
  }
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/cf-exec.mjs <command...>')
  process.exit(1)
}

const env = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: apiToken,
  CLOUDFLARE_ACCOUNT_ID: accountId,
}

const proc = spawnSync('npx', args, {
  stdio: 'inherit',
  shell: true,
  env,
  cwd: path.resolve('worker'),
})

process.exit(proc.status ?? 0)
