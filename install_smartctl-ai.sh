#!/bin/sh
# This script creates /usr/local/bin/smartctl-ai for crontab use and makes it executable.

cat > /usr/local/bin/smartctl-ai <<'EOF'
#!/bin/sh

# Change working directory
cd /opt/smartctl-ai

# Start the task
node app.ts
EOF

chmod +x /usr/local/bin/smartctl-ai
echo "Script /usr/local/bin/smartctl-ai created and made executable."
