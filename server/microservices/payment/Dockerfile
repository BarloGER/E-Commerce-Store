FROM node:20.9.0

WORKDIR /app

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

# Copy 'package.json' und 'package-lock.json'
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the source code
COPY . .

# Copy the start script into the container
COPY entrypoint.sh /entrypoint.sh

# Ensure that the start script is executable
RUN chmod +x /entrypoint.sh

# Ensure that all native dependencies for the Linux system are recompiled in the container.
# RUN npm rebuild <modulname> --build-from-source

# Expose the port on which the service runs
EXPOSE 8085

# Define the start script as ENTRYPOINT
ENTRYPOINT ["/entrypoint.sh"]