
FROM mongo

WORKDIR /usr/src/app

COPY . .

RUN chmod +x init-mongo.sh

CMD ["sh", "-c", "/usr/src/app/init-mongo.sh"]
