# Codefolio API [![Build Status](https://travis-ci.com/msmfsd/codefolio-api.svg?token=pQuZQVJCHi2ifpjKbzd7&branch=master)](https://travis-ci.com/msmfsd/codefolio-api)

> RESTful API for the Codefolio application

#### Requirements
- npm v3+ & node v5+
- MongoDB v2.6.5+
- Codefolio - [get it here](https://github.com/msmfsd/codefolio).

## Getting started
1. Clone this repo with ```git clone https://github.com/msmfsd/codefolio-api.git```
2. Open directory
3. Run ```npm install```
4. * Remove existing git directory with ```rm -rf .git```
5. Make your own .git with ```git init```
6. Rename .env.example to .env and enter your settings.
7. NOTE: Git ignore your .env file - it should never by shared to the public
8. Note that your default profile will be automatically saved to db with dummy content on its initial startup so launch this Codefolio API server before trying to setup your Codefolio application to view and administer your folio.

## Start dev server
1. Run ```mongod``` command
2. Run ```npm dev``` command
3. Open browser at [http://localhost:8090/](http://localhost:8090/)

## Tests
1. Run ```npm run lint``` command
2. Run ```npm run test``` command

## Start production server [Linux/Mac]
1. Upload your code and ensure requirements as above
2. Run ```mongod``` command
3. Run ```npm install``` command
4. Run ```npm install -g pm2``` command
5. Run ```pm2 start server.js``` command

##### How to create your Codefolio site to connect to this Codefolio API
1. Install Codefolio - it can be found here: [Codefolio](https://github.com/msmfsd/codefolio)
2. Follow the Codefolio setup guide in the Codefolio Readme
3. Update the Codefolio config with your Codefolio API's API_KEY from .env
4. Update the Codefolio config with your server host name that you publish this API on to.


> NOTE: Codefolio API & Codefolio are seperate projects that connect with each other to create your developer folio website. This is the RESTful API that performs CRUD operations on data requested by your Codefolio website. The API and front-end application are separated for ease of use, security and best practice.

>Locally you can run both servers on different localhost ports: say your Codefolio site is on localhost:3000 and this API is on localhost: 8090. For production you will need 2 public server endpoints and some knowledge of server admin could be advantageous. An example live setup could be:

> Codefolio API - create an AWS Ubuntu instance with Nginx/Node/MongoDB

> Codefolio - Deploy to your Heroku dyno

## Contributing
Feel free to open an issue or post a pull request

All contributions are appreciated!

## License
MIT License
