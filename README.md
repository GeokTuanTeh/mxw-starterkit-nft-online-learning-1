
# Name

Online Learning Tutorial


## Description

This is simple online learning tutorial that's built using blockchain SDK from mxw-sdk-js. The tutorial is written in Typescript.


## Pre-requisite

Please clone or download Maxonrow locally before start with this starter kit https://github.com/maxonrow/maxonrow-go/tree/develop/docker. 


## Installation

Clone or download the project. In terminal, navigate to project path, run the following command:

```
npm install
```

To compile the project, use command:
```
tsc
```

Online Learning tutorial is organized into methods for individual function. To run the project, open file `/src/online-learninig.ts` for reference on list of methods available. It can be run with command:
```
node dist/onlinelearning/online-learning.js <method_name>
```

Third argument is the method to call, followed by the method’s parameter(s), if any. For example, below command shows how we can trigger `addCourse()` method using parameter `Art`:
```
node dist/onlinelearning/online-learning.js addCourse Art
```



