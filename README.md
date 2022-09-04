# kafka-nodejs-auth-flow

Kafka Authentication Flow using NodeJS

## Table of contents
* [General info](#general-info)
* [How it works](#how-it-works)
* [Backend Technologies](#backend-technologies)
* [Frontend Technologies](#frontend-technologies)
* [Frontend](#frontend)
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

## Frontend

![Screenshot 2022-09-04 at 23 23 12](https://user-images.githubusercontent.com/62521597/188332102-611de87b-ab96-4afa-80d3-6b89159029bf.png)
![Screenshot 2022-09-04 at 23 22 18](https://user-images.githubusercontent.com/62521597/188332106-c0e32d0e-22e2-4c7c-898e-d9e14f3561d9.png)
![Screenshot 2022-09-04 at 23 13 02](https://user-images.githubusercontent.com/62521597/188332109-294f0ef2-bc57-4101-8f84-aa5d72d4951b.png)
<br/>
## Setup and running
To run this project locally, use Docker:

```
$ docker-compose up
```
