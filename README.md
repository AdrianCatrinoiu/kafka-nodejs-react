# kafka-nodejs-auth-flow

Kafka Authentication Flow using NodeJS

## Table of contents
* [General info](#general-info)
* [How it works](#how-it-works)
* [Backend Technologies](#backend-technologies)
* [Frontend Technologies](#frontend-technologies)
* [Setup](#setup-and-running)

## General Info
Full-stack React,NodeJS Auth SPA which uses Kafka on the backend side for decoupling backend components.
<br/> <br/>
### How it works
- The user can either register, login or view User details in the React Web App and the authentication flow is done using JWT tokens with rotation (refresh tokens).
- It uses Redis for in memory data storage of user details.
- The relationship between endpoints and the data store is done using a Kafka Topic (called 'users'), a Producer and a Consumer.
- Producer, Consumer and React-ui have their own Dockerfile and are defined together in docker-compose.
<br/> <br/>
## Backend Technologies
* **NodeJS** version: 16.16.0
* **Express** version: 4.17.1
* **Redis** version: 4.3.0
* **Kafka-node** version: 2.6.1
* **JWT** version: 8.5.1
<br/>

## Frontend Technologies
* **React** version: 17.0.2
* **Reduxjs/toolkit** version: 1.8.5
* **Formik** version: 2.2.6
* **React Router** version: 6.3.0
* **Yup** version: 0.32.9
<br/>

## Setup and running
To run this project locally, use Docker:

```
$ docker-compose up
```
