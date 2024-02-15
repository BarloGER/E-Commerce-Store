#!/bin/sh
# This script is used as the entry point for the account container. It loads the environment variables from the AWS Parameter Store and then starts the application.

# Function to get an environment variable from the AWS Parameter Store
get_parameter() {
  aws ssm get-parameter --name "$1" --with-decryption --query "Parameter.Value" --output text
}

# Load and export environment variables for the account service
export SECRET_KEY=$(get_parameter "SECRET_KEY") || { echo "Failed to retrieve SECRET_KEY"; exit 1; }
export MONGO_URI=$(get_parameter "MONGO_URI") || { echo "Failed to retrieve MONGO_URI"; exit 1; }

# Now start the application
exec node index.js