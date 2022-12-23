# Discord-Bot-Uniblock-

Discord Bot using Uniblock (https://docs.uniblock.dev/)

# Functionalities

To Be Discussed

# Things to know before developing

## npm scripts

`npm commands:deploy`: deploy commands to discord, always run this first when adding new commands
`npm start`: run the project

## ./config.json

create `./config.json`, and fill in these variables:

```
  {
    "token": <Found in: Discord Developer Portal => Bot>
    "clientId": <Found in: Discord Developer Portal => OAuth2 => General>
  }
```



## Setup discord bot on GCP cloud run jobs

1. Build the docker image
```
docker build -t us.gcr.io/<INPUT-PROJECT-ID>/discord-bot:0.0.1 .
```

2. Push to GCP Cloud Registry
```
docker push us.gcr.io/<INPUT-PROJECT-ID>/discord-bot:0.0.1
```

3. Navigate to your corresponding project and create a new COMPUTE ENGINE instance
and select "DEPLOY CONTAINER".
Finish and create instance and docker container with discord bot should be running now.
