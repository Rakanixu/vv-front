#!/bin/bash

if ! docker build -t "$PREFIX/frontend:$TAG" . ; then
    echo "Error building image"
    exit 1;
fi
