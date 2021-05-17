#!/bin/bash

FOLDERS=( Prototype Web Server Client)

for folder in ${FOLDERS[@]}
do
  echo copy core files to ./${folder}
  rm -rf ../${folder}/src/core
  mkdir -p ../${folder}/src/core/
  cp -v ./src/* ../${folder}/src/core/
  chmod -w ../${folder}/src/core/*
done



