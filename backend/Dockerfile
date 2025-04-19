# Uses Python 3.13 image
FROM python:3.13

# Sets the working directory inside the container to /app
WORKDIR /app

# Copies only the requirements.txt file into the container
# This is done before copying the rest of the code so docker can cache dependency installs
COPY requirements.txt ./
# Installs Python dependencies listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copies the rest of your backend into container
COPY . .

# Exposes port 6000 (this is just a hint, it does not actually open any ports)
# EXPOSE 6000

# Starts server.py
CMD ["python", "./src/server.py"]