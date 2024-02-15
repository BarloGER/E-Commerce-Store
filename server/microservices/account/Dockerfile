FROM node:20.9.0

# Set the working directory in the container
WORKDIR /app

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

# Copy 'package.json' und 'package-lock.json'
COPY package*.json ./

# Install dependencies
# 'npm ci' installs the dependencies from 'package.json' and 'package-lock.json' in a clean state.
RUN npm ci --only=production

# If you also need dev dependencies in the container, remove '--only=production'

# Copy the remaining source code into the working directory
COPY . .

# Copy the start script into the container
COPY entrypoint.sh /entrypoint.sh

# Make sure that the start script is executable
RUN chmod +x /entrypoint.sh

# Make sure that all native dependencies for the Linux system are recompiled in the container 
# This is necessary for modules like 'bcrypt' that use native bindings.
RUN npm rebuild bcrypt --build-from-source

# Expose the port on which the service is running
EXPOSE 8081

# Define the start script as ENTRYPOINT
ENTRYPOINT ["/entrypoint.sh"]
