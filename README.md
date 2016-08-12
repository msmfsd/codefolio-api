# Codefolio API [![Build Status](https://travis-ci.com/msmfsd/codefolio-api.svg?token=pQuZQVJCHi2ifpjKbzd7&branch=master)](https://travis-ci.com/msmfsd/codefolio-api)

Codefolio project is an open source build-your-own folio website & CMS for developers to showcase their skills and work. See the [Codefolio + Codefolio API Guide](https://github.com/msmfsd/codefolio-guide) as the first point of reference.

> Codefolio & Codefolio API are seperate projects that connect with each other to create your developer folio. Codefolio is the static front-end website & CMS that displays your folio to the public and allows you to manage it's content. Codefolio API is a RESTful API server that performs CRUD operations on data requested by your Codefolio site.

#### Demo
- [View Codefolio preview](https://goo.gl/photos/fqhDKEvH9RTejUzY9)

#### Requirements
- npm v3+ & node v4+
- MongoDB v2.6.5+
- [Codefolio](https://github.com/msmfsd/codefolio)
- To enable forgot password functionality you will need a free [Sendgrid](https://sendgrid.com/) account, take note of your username and password

#### Getting started
1. Clone this repo with ```git clone https://github.com/msmfsd/codefolio-api.git```
2. Open directory
3. Run ```npm install```
4. Remove existing git directory with ```rm -rf .git```
5. Make your own .git with ```git init```

#### Node ENV Configuration
1. Copy the ***.env.example*** file in the root directory and rename it to ***.env***
2. Follow the instructions carefully in the comments of the file

#### Start dev server
1. Run ```mongod``` command in a seperate terminal window
2. Run ```npm dev``` command
3. Use [Postman](https://www.getpostman.com/) or a browser to test your API works @ [http://localhost:8080/](http://localhost:8080/)
4. Install [Codefolio](https://github.com/msmfsd/codefolio) locally to connect to the API and build your folio

#### Deploy API to production server
1. Follow the [Codefolio + Codefolio API Guide](https://github.com/msmfsd/codefolio-guide)

#### Contributing
Feel free to open an issue or post a pull request

#### License
MIT License
