#!/bin/bash 
#
# Script to spin up development environment with all dependencies satisfied
#

# Script to execute in container
read -r -d '' script <<'EOF'
echo '*** Starting testrpc'
nohup testrpc --gasLimit 1111115141592 -g 1  -m volatility --account='0xafb293409a8c87be6ca3ca2ff1fca89af95e5dcf0bcb15125786b43a080de122,0x1000000000000000' > /tmp/testrpc.log 2>&1 &

echo '*** Compiling contract'
cd /app/contract
truffle compile

echo '*** Migrating contract'
truffle migrate

echo '*** Updating config'
truffle exec info.js > ../ui/src/config.js

echo '*** Installing dependencies'
cd ../ui && npm install 

echo '*** Starting app'
npm start
EOF

# Configuration
BASE_DIR=$(dirname $(realpath $0))
APP_PORT=3000
RPC_PORT=8545

# Execute
docker run -it -v $BASE_DIR:/app -p $APP_PORT:3000 -p $RPC_PORT:8545 unpatent/docker-truffle /bin/bash -e -c "$script"

