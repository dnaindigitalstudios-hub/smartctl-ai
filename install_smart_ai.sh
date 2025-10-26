#!/bin/sh
# This script creates /usr/local/bin/smart_ai.sh for crontab use and makes it executable.

cat > /usr/local/bin/smart_ai.sh <<'EOF'
#!/bin/sh

# Change working directory
cd /opt/smartctl-ai

# Start the task
node app.ts
EOF

chmod +x /usr/local/bin/smart_ai.sh
echo "Script /usr/local/bin/smart_ai.sh created and made executable."
