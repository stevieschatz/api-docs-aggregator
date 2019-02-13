#!/usr/bin/env bash

SERVICE_NAME="api-docs-aggregator"
MARATHON_URL="TODO add your marthoan url "
MARATHON_ID="TODO ADD YOUR MARATHON ID"

API_DOMAIN="TODO ADDD YOURS"

curl -X PUT -H "Content-Type: application/json" TODO ADD YOUR MARATHON URL HERE -d@marathon.json
if [ $? -eq 0 ]; then
            echo " "
            echo "SUCCESSFUL DEPLOY!"
            echo "$MARATHON_URL/v2/apps$MARATHON_ID"
            echo " "
            echo "MARATHON STAGE:  TODO ADD YOUR MARATHON URL HERE"

            echo " "
            echo "DOMAIN STAGE: http://$API_DOMAIN"
            echo " "
            exit 0;
        else
            echo "Error occurred during the last command, please check"
            exit 1;
        fi
