#!/bin/sh

tar -zcvf server-archive.tar.gz server/

sftp pi@192.168.1.14 <<EOT
put server-archive.tar.gz tactile-edu/server-archive.tar.gz
bye
EOT

ssh pi@192.168.1.14 <<EOT
cd tactile-edu
mkdir temp-audio
mv server/audio/* temp-audio
rm -r server
tar -zxvf server-archive.tar.gz
cp credentials/sql-credentials.js server/sql/credentials.js
cp credentials/polly-config.json server/polly/config.json
rm -r server/audio/*
mv temp-audio/* server/audio
rm -r temp-audio
rm server-archive.tar.gz
EOT

rm server-archive.tar.gz
