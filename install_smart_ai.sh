#!/bin/sh
# This script creates /usr/local/bin/smart_ai for crontab use and makes it executable.

cat > /usr/local/bin/smart_ai <<'EOF'
#!/bin/sh

# Change working directory
cd /opt/smartctl-ai

# Start the task
node app.ts
EOF

chmod +x /usr/local/bin/smart_ai
echo "Script /usr/local/bin/smart_ai created and made executable."
