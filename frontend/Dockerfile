FROM node:alpine

WORKDIR /app 
COPY . /app 
RUN npm install --global yarn
RUN yarn install 

EXPOSE 3000 3010

CMD ["yarn", "start"]