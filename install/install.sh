#!/usr/bin/env bash


dir=$(dirname `pwd`)
user=$2
group=$3

if [ "$1" == "" ] || ["$1" == "" ]; then
    echo "No arguments provided, please provide: 1:Environment (default: development), 2: user, 3: group"
    exit 1
fi

echo "Creating directories for public storage..."

mkdir $dir/public/i
mkdir $dir/public/t
mkdir $dir/public/o
mkdir $dir/public/a
mkdir $dir/public/v

echo "Directories created"
echo "Installing node dependencies"

npm install --prefix $dir

echo "Node deps installed"


cat << EOF > /etc/systemd/system/comfash-be.service

[Unit]
Description=comfash-be

[Service]
PIDFile=/tmp/comfash-be.pid
ExecStart=/usr/local/bin/node $dir/server.js
Restart=always
User=$user
Group=$group  
Environment=PATH=/usr/bin:/usr/local/bin
Restart=always
KillSignal=SIGQUIT
WorkingDirectory=$dir/
SyslogIdentifier=comfash-be


[Install]
WantedBy=multi-user.target

EOF

echo "Service file created"

systemctl enable comfash-be.service

systemctl start comfash-be.service

systemctl status comfash-be.service
