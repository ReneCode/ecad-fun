echo copy share files to ./Server and ./Web

rm -rf ../Server/src/share
rm -rf ../Web/src/share

mkdir -p ../Server/src/share/
mkdir -p ../Web/src/share/

cp -v ./src/* ../Server/src/share/
cp -v ./src/* ../Web/src/share/

chmod -w ../Server/src/share/*
chmod -w ../Web/src/share/*