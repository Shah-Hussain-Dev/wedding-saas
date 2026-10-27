# 🚀 Production Deployment & CI/CD Guide for WedInvites (`wedinvites.in`)

Complete step-by-step production runbook to deploy **WedInvites (Next.js 16 + Prisma + Tailwind CSS v4)** on an **Ubuntu KVM2 VPS**, configure your **GoDaddy domain (`wedinvites.in`)** replacing Vercel, set up **Nginx with Let's Encrypt SSL**, and automate zero-downtime releases via **GitHub Actions CI/CD**.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites Checklist](#2-prerequisites-checklist)
3. [Step 1: Point GoDaddy DNS to Your VPS (Switch from Vercel)](#step-1-point-godaddy-dns-to-your-vps-switch-from-vercel)
4. [Step 2: Initial VPS Setup, Security & Swap Space](#step-2-initial-vps-setup-security--swap-space)
5. [Step 3: Install Node.js 20 LTS, PM2, Nginx & Certbot](#step-3-install-nodejs-20-lts-pm2-nginx--certbot)
6. [Step 4: Clone Repository & Configure Environment Variables](#step-4-clone-repository--configure-environment-variables)
7. [Step 5: PM2 Process Manager Configuration](#step-5-pm2-process-manager-configuration)
8. [Step 6: Configure Nginx as Reverse Proxy](#step-6-configure-nginx-as-reverse-proxy)
9. [Step 7: Issue Free SSL Certificate (Let's Encrypt)](#step-7-issue-free-ssl-certificate-lets-encrypt)
10. [Step 8: Set Up GitHub Actions CI/CD Pipeline](#step-8-set-up-github-actions-cicd-pipeline)
11. [Step 9: Update 3rd-Party OAuth & Webhook Callbacks](#step-9-update-3rd-party-oauth--webhook-callbacks)
12. [Step 10: Maintenance, Monitoring & Troubleshooting Runbook](#step-10-maintenance-monitoring--troubleshooting-runbook)

---

## 1. Architecture Overview

```text
[ Browser / User ] 
       │ (HTTPS: 443 / HTTP: 80)
       ▼
[ GoDaddy DNS: wedinvites.in ] ──> Points to VPS Public IP
       │
       ▼
[ Ubuntu KVM2 VPS Firewall (UFW) ]
       │
       ▼
[ Nginx Reverse Proxy (Port 80/443 + Let's Encrypt SSL + HTTP/2) ]
       │ (Internal Proxy: http://127.0.0.1:3000)
       ▼
[ PM2 Cluster Mode (Node.js 20 Next.js 16 App: wedinvites) ]
       │
       ├──> [ Supabase PostgreSQL (Port 6543 / 5432) ]
       ├──> [ Cloudinary (Image & Audio Storage) ]
       └──> [ Razorpay (Payment Gateway) ]
```

---

## 2. Prerequisites Checklist

Before beginning, ensure you have:
- [x] Ubuntu 22.04 LTS or 24.04 LTS on KVM2 VPS with root SSH access.
- [x] Your VPS Public IPv4 Address (e.g. `123.45.67.89`).
- [x] GoDaddy account login with access to `wedinvites.in`.
- [x] GitHub Repository with admin access (to configure Secrets for CI/CD).
- [x] Supabase PostgreSQL connection strings (Pooled and Direct).

---

## Step 1: Point GoDaddy DNS to Your VPS (Switch from Vercel)

Because your domain was previously connected to Vercel, you need to remove Vercel's records and point the domain directly to your VPS IP address.

### 1. Log in to GoDaddy
1. Go to [GoDaddy Domain Portfolio](https://dcc.godaddy.com/control/portfolio).
2. Click on **wedinvites.in** and select **DNS** (or **Manage DNS**).

### 2. Remove Old Vercel DNS Records
Look through the DNS records list and **Delete**:
- Any **A Record** pointing to `76.76.21.21` (Vercel IP).
- Any **CNAME Record** for `www` or `@` pointing to `cname.vercel-dns.com`.
- Any `_vercel` TXT verification records.

### 3. Add Your VPS Records
Add or update the following records:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `<YOUR_VPS_PUBLIC_IP>` | 600 seconds (or 1/2 Hour) |
| **A** or **CNAME** | `www` | `wedinvites.in` (or `<YOUR_VPS_PUBLIC_IP>`) | 600 seconds |

> [!NOTE]
> DNS propagation typically takes 5–30 minutes. Verify propagation from your terminal using:
> ```bash
> dig +short wedinvites.in
> # Or:
> nslookup wedinvites.in
> ```
> Once it returns your VPS IP address, you are ready for SSL and Nginx setup.

---

## Step 2: Initial VPS Setup, Security & Swap Space

Log into your VPS via SSH as `root`:
```bash
ssh root@<YOUR_VPS_PUBLIC_IP>
```

### 1. Update Server Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw htop fail2ban unzip build-essential
```

### 2. Configure 4GB Swap Space (Crucial for KVM2 VPS)
Next.js production compilation (`npm run build`) can spike memory usage. Creating a 4GB swap prevents `JavaScript heap out of memory` errors during builds:

```bash
# Check existing swap
sudo swapon --show

# Create a 4GB swapfile if none exists
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swappiness for server workloads
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### 3. Create a Dedicated Deployment User (Recommended)
Avoid running applications as `root`:
```bash
# Create deploy user
sudo adduser --gecos "" deploy
sudo usermod -aG sudo deploy

# Allow passwordless sudo for deploy (essential for automated CI/CD deployments)
echo "deploy ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/deploy
sudo chmod 0440 /etc/sudoers.d/deploy

# Copy SSH keys to deploy
sudo mkdir -p /home/deploy/.ssh
sudo cp /root/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### 4. Configure UFW Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp        # OpenSSH
sudo ufw allow 80/tcp        # HTTP
sudo ufw allow 443/tcp       # HTTPS
sudo ufw --force enable
sudo ufw status verbose
```

---

## Step 3: Install Node.js 20 LTS (via NVM), PM2, Nginx & Certbot

Switch to your `deploy` user before installing NVM (so Node.js is installed in `/home/deploy/.nvm`):
```bash
su - deploy
```

### 1. Install NVM (Node Version Manager) & Node.js 20 LTS
Installing Node via NVM keeps all binaries within `/home/deploy/.nvm`, prevents permission issues with global packages, and avoids needing `sudo` for npm:

```bash
# 1. Download and run NVM installer (v0.40.1)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 2. Source NVM into current shell (or reopen terminal)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 3. Install Node.js 20 LTS and set as default
nvm install 20
nvm use 20
nvm alias default 20

# 4. Verify installation
node -v      # Should output v20.x.x
npm -v       # Should output v10.x.x
which node   # Should output /home/deploy/.nvm/versions/node/v20.x.x/bin/node
```

### 2. Install PM2 Globally (No Sudo Needed)
Because Node was installed via NVM, global npm packages install directly into `/home/deploy/.nvm/.../bin` without requiring `sudo`:
```bash
npm install -g pm2
pm2 -v
```

### 3. Install Nginx & Certbot (System Packages)
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## Step 4: Clone Repository & Configure Environment Variables

### 1. Create Web Directory and Set Permissions
```bash
sudo mkdir -p /var/www/wedinvites
sudo chown -R deploy:deploy /var/www/wedinvites
sudo chmod -R 775 /var/www/wedinvites

# Create log directory for PM2
sudo mkdir -p /var/log/wedinvites
sudo chown -R deploy:deploy /var/log/wedinvites
```

### 2. Clone the Git Repository
> [!NOTE]
> Pay attention to the trailing space and dot (`.`) at the end of the clone command. That dot instructs Git to clone directly into `/var/www/wedinvites` rather than creating a nested `wedding-saas` folder.

```bash
cd /var/www/wedinvites

# If using HTTPS (notice the trailing dot .):
git clone https://github.com/<YOUR_GITHUB_USER>/<YOUR_REPO_NAME>.git .

# Or if you configured SSH keys on GitHub:
# git clone git@github.com:<YOUR_GITHUB_USER>/<YOUR_REPO_NAME>.git .
```

*If you already cloned without the trailing dot and have a nested `/var/www/wedinvites/wedding-saas` folder, move everything up with:*
```bash
shopt -s dotglob
mv /var/www/wedinvites/wedding-saas/* /var/www/wedinvites/
rmdir /var/www/wedinvites/wedding-saas
```

### 3. Configure Production `.env`
Create `/var/www/wedinvites/.env`:
```bash
nano /var/www/wedinvites/.env
```

Paste your production values:
```env
# 🌐 1. APPLICATION URLS
NEXT_PUBLIC_APP_URL="https://wedinvites.in"
NEXT_PUBLIC_APP_NAME="WedInvites"

# 🗄️ 2. SUPABASE POSTGRESQL & PRISMA
DATABASE_URL="postgresql://postgres.qmfphurloqedvnyztsta:<YOUR_DB_PASSWORD>@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:<YOUR_DB_PASSWORD>@db.qmfphurloqedvnyztsta.supabase.co:5432/postgres"

# 🔐 3. NEXTAUTH & SECURITY
# Generate a new 32-char secret with: openssl rand -base64 32
NEXTAUTH_SECRET="<YOUR_STRONG_RANDOM_SECRET_KEY>"
NEXTAUTH_URL="https://wedinvites.in"

# 🔑 4. GOOGLE OAUTH CREDENTIALS
GOOGLE_CLIENT_ID="846634253715-stlp07kv50dqpvam63f0orng9ns4kcl8.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="<YOUR_GOOGLE_CLIENT_SECRET>"

# 💳 5. RAZORPAY PAYMENT GATEWAY
# For live payments, replace test keys with live keys (rzp_live_...)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_TdaOt3AxjNqknx"
RAZORPAY_KEY_ID="rzp_test_TdaOt3AxjNqknx"
RAZORPAY_KEY_SECRET="7F58u7a9C9QsHYmvqScIbWZ8"
RAZORPAY_WEBHOOK_SECRET="<YOUR_RAZORPAY_WEBHOOK_SECRET>"

# ☁️ 6. CLOUDINARY MEDIA STORAGE
CLOUDINARY_CLOUD_NAME="deki7n2z"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="deki7n2z"
CLOUDINARY_API_KEY="837926617137826"
CLOUDINARY_API_SECRET="AnANYnVVtf9d-Rsn8iLTpG-8axw"
CLOUDINARY_UPLOAD_PRESET="unfold_wedding_uploads"
CLOUDINARY_URL="cloudinary://837926617137826:AnANYnVVtf9d-Rsn8iLTpG-8axw@deki7n2z"
AUDIO_STORAGE="cloudinary"

# 📧 7. SMTP / EMAIL
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=587
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
EMAIL_FROM="support@wedinvites.in"
```
Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit.

### 4. Install Dependencies & Run Initial Build
> [!IMPORTANT]
> Always use `npm ci` rather than `npm i`. Running `npm i` can fetch `prisma@latest` (which NPM has pointed to experimental Prisma 8 / `@prisma/composer`), causing `No command registered for generate`. `npm ci` strictly installs the locked, working Prisma `7.8.0` from `package-lock.json`.

```bash
cd /var/www/wedinvites

# Install exact locked dependencies
npm ci

# If postinstall hook ever fails due to a global prisma conflict, use:
# npm ci --ignore-scripts

npx prisma generate
npx prisma db push
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

---

## Step 5: PM2 Process Manager Configuration

We included `ecosystem.config.js` in the project root.

### 1. Start WedInvites with PM2
```bash
cd /var/www/wedinvites
pm2 start ecosystem.config.js
```

### 2. Verify PM2 Status
```bash
pm2 status
pm2 logs wedinvites --lines 20
```

### 3. Enable PM2 on Server Boot (with NVM)
To ensure PM2 launches WedInvites automatically after a server reboot when using NVM, run:
```bash
pm2 startup systemd -u deploy --hp /home/deploy
```

PM2 will inspect your NVM environment and output a customized `sudo env PATH=...` command. **Copy and run the exact line printed by PM2 in your terminal**, for example:
```bash
# Example output from PM2 (run the exact line shown in your terminal):
sudo env PATH=$PATH:/home/deploy/.nvm/versions/node/$(node -v)/bin $(which pm2) startup systemd -u deploy --hp /home/deploy
```

Finally, freeze the process list so PM2 resurrects WedInvites across reboots:
```bash
pm2 save
```

---

## Step 6: Configure Nginx as Reverse Proxy

Create the Nginx server block configuration for `wedinvites.in`:

```bash
sudo nano /etc/nginx/sites-available/wedinvites.in
```

Paste the following configuration:

```nginx
# Map for WebSocket upgrade headers
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    listen [::]:80;
    server_name wedinvites.in www.wedinvites.in;

    # Maximum upload size for photos/audio
    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Static assets caching
    location /_next/static/ {
        alias /var/www/wedinvites/.next/static/;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public/ {
        alias /var/www/wedinvites/public/;
        expires 30d;
        access_log off;
    }

    # Reverse Proxy to Next.js running on Port 3000
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for streaming & long requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 2. Enable Configuration & Test Nginx
```bash
# Enable the site
sudo ln -sf /etc/nginx/sites-available/wedinvites.in /etc/nginx/sites-enabled/

# Remove default site if present
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 7: Issue Free SSL Certificate (Let's Encrypt)

Run Certbot to obtain free SSL certificates and automatically configure HTTPS redirection:

```bash
sudo certbot --nginx -d wedinvites.in -d www.wedinvites.in
```

Certbot will ask for:
1. Your email address for urgent renewal and security notices.
2. Agree to the Terms of Service (`Y`).
3. Whether to redirect HTTP traffic to HTTPS (choose **2: Redirect**).

### Verify SSL Auto-Renewal
Let's Encrypt certificates are valid for 90 days. Certbot installs a systemd timer that auto-renews. Test it with:
```bash
sudo certbot renew --dry-run
```

---

## Step 8: Set Up GitHub Actions CI/CD Pipeline

The repository includes [`.github/workflows/deploy.yml`](file:///Volumes/DATA/my-projects/business/wedding-saas/.github/workflows/deploy.yml) and [`scripts/deploy.sh`](file:///Volumes/DATA/my-projects/business/wedding-saas/scripts/deploy.sh). Every push to `main` will automatically build, test, and deploy to your VPS with zero downtime.

### 1. Generate a Dedicated SSH Key Pair for GitHub Actions
On your local machine (or on the server):
```bash
ssh-keygen -t ed25519 -C "github-actions-wedinvites" -f ~/.ssh/github_actions_wedinvites -N ""
```
This generates:
- `~/.ssh/github_actions_wedinvites` (Private Key — goes to GitHub Secrets)
- `~/.ssh/github_actions_wedinvites.pub` (Public Key — goes to VPS)

### 2. Add the Public Key to the VPS
On your VPS as user `deploy`:
```bash
# Ensure .ssh exists and is owned by deploy (in case it was created as root)
sudo mkdir -p ~/.ssh
sudo chown -R deploy:deploy ~/.ssh
chmod 700 ~/.ssh

# Append the public key
echo "<PASTE_CONTENTS_OF_github_actions_wedinvites.pub>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Add GitHub Secrets to Your Repository
1. Navigate to your GitHub repository: **Settings > Secrets and variables > Actions > New repository secret**.
2. Add the following 4 secrets:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `VPS_HOST` | `123.45.67.89` | Your VPS Public IPv4 Address |
| `VPS_USER` | `deploy` | The deployment user created on the VPS |
| `VPS_SSH_KEY` | *(Entire content of `github_actions_wedinvites` private key)* | Includes `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` |
| `VPS_PORT` | `22` | Default SSH port (or custom port if modified) |

### 4. Test the Pipeline
Push a commit to the `main` branch:
```bash
git add .
git commit -m "feat: setup automated VPS deployment pipeline"
git push origin main
```
Go to **Actions** in your GitHub repository and watch the pipeline build and deploy live!

---

## Step 9: Update 3rd-Party OAuth & Webhook Callbacks

Now that your production domain is `https://wedinvites.in`:

### 1. Google Cloud Console (OAuth 2.0)
1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
2. Click your OAuth 2.0 Client ID.
3. Under **Authorized JavaScript origins**, add:
   - `https://wedinvites.in`
   - `https://www.wedinvites.in`
4. Under **Authorized redirect URIs**, add:
   - `https://wedinvites.in/api/auth/callback/google`
   - `https://www.wedinvites.in/api/auth/callback/google`
5. Save changes.

### 2. Razorpay Dashboard (Webhooks)
1. Go to [Razorpay Dashboard > Settings > Webhooks](https://dashboard.razorpay.com/#/access/webhooks).
2. Add or update the Webhook URL:
   - `https://wedinvites.in/api/webhooks/razorpay`
3. Select events: `order.paid`, `payment.captured`, `payment.failed`.

---

## Step 10: Maintenance, Monitoring & Troubleshooting Runbook

### Useful Day-to-Day Commands

```bash
# Check application status & live metrics
pm2 status
pm2 monit

# View live application logs
pm2 logs wedinvites
pm2 logs wedinvites --lines 100

# Reload application with zero downtime (after manual code edits)
pm2 reload wedinvites

# Restart application
pm2 restart wedinvites

# Test Nginx and reload
sudo nginx -t
sudo systemctl reload nginx

# View live Nginx access/error logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Troubleshooting Common Issues

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **502 Bad Gateway** | Next.js app is stopped or crashing on port 3000 | Check `pm2 logs wedinvites` and `curl http://127.0.0.1:3000`. Ensure PM2 is running. |
| **Out of Memory during `npm run build`** | Node.js ran out of RAM | Verify swap is enabled with `swapon --show`. Use `NODE_OPTIONS="--max-old-space-size=2048" npm run build`. |
| **SSL Certificate Error / Not Secure** | Certbot was not run or DNS hasn't propagated | Verify `dig +short wedinvites.in` returns your VPS IP, then run `sudo certbot --nginx -d wedinvites.in -d www.wedinvites.in`. |
| **Google Sign-in "redirect_uri_mismatch"** | Callback URL mismatch | Ensure `https://wedinvites.in/api/auth/callback/google` is added to Google Cloud Console. |
| **Prisma "P1001: Can't reach database server"** | Supabase connection issue or network restriction | Verify `DATABASE_URL` and `DIRECT_URL` in `/var/www/wedinvites/.env`. Ensure IPv4/pooler string is used. |
| **`node` or `pm2: command not found`** | Non-interactive shell didn't load NVM | Source NVM before running commands: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`. |

---

### 🎉 Summary
Your **WedInvites** application is now fully decoupled from Vercel and running directly on your **KVM2 Ubuntu VPS** behind Nginx with SSL and automated GitHub Actions CI/CD!
