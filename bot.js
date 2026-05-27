const { execSync, spawn } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env
require('dotenv').config({ path: '/home/dev/.env' });

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PROJECT_DIR = '/home/dev/projects/rescroll';

let offset = 0;

function sendMessage(chatId, text) {
  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' });
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${TOKEN}/sendMessage`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  };
  const req = https.request(options);
  req.write(body);
  req.end();
}

function runClaudeCode(chatId, instruction) {
  sendMessage(chatId, `⚙️ Working on: _${instruction}_`);

  const proc = spawn('claude', [
    '--print',
    '--dangerously-skip-permissions',
    instruction
  ], {
    cwd: PROJECT_DIR,
    env: { ...process.env, ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY }
  });

  let output = '';
  proc.stdout.on('data', d => output += d.toString());
  proc.stderr.on('data', d => output += d.toString());

  proc.on('close', (code) => {
    // Auto push to GitHub
    try {
      execSync('git add . && git commit -m "bot update" && git push origin main', { cwd: PROJECT_DIR });
      sendMessage(chatId, `✅ Done! Changes pushed to GitHub — Vercel is redeploying now.\n\n\`\`\`${output.slice(0, 500)}\`\`\``);
    } catch (e) {
      sendMessage(chatId, `✅ Done! (No git changes)\n\n\`\`\`${output.slice(0, 500)}\`\`\``);
    }
  });
}

function poll() {
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.result && json.result.length > 0) {
          for (const update of json.result) {
            offset = update.update_id + 1;
            const msg = update.message;
            if (msg && msg.text) {
              console.log(`[${msg.from.username}]: ${msg.text}`);
              runClaudeCode(msg.chat.id, msg.text);
            }
          }
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
      poll();
    });
  });

  req.on('error', (e) => {
    console.error('Poll error:', e);
    setTimeout(poll, 5000);
  });

  req.end();
}

console.log('Rescroll bot running...');
poll();
