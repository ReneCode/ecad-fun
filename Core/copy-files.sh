echo copy cord files to ./Prototype

rm -rf ../Prototype/src/core

mkdir -p ../Prototype/src/core/

cp -v ./src/* ../Prototype/src/core/

chmod -w ../Prototype/src/core/*
