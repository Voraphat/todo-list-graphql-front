# ใช้ Jenkins LTS image
FROM jenkins/jenkins:lts

# สลับไปที่ root user
USER root

# ติดตั้ง curl และ Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# ตรวจสอบการติดตั้ง Node.js และ npm
RUN node -v && npm -v

# กลับไปใช้ Jenkins user
USER jenkins
