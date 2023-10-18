# Gan Test project

This is a basic setup of a Node Application with Express. I have created it from scratch to create a bare minimum project, as well as to better highlight my skills.

To better explain my thought process, each folder has a README that explains the purpose of it.

# Requirements

The solution is build with **node 18.13** and **npm 9.5.0**

## Project setup
The project is build with Typescript, and has support for Dockerization for deployments in various clouds

# Commands
To run the project, run this in the command line, it supports concurrency to allow file editing while serving

```npm run dev``` 

To build the solution run

```npm run build``` 

To create a docker image run the following command (requires Docker installed)

```docker build -t gan-test -f Dockerfile .```