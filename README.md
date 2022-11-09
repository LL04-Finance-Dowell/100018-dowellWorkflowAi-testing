# 100018-dowellWorkflowAi-testing

## for project team members
- Be working on a branch other than `main`, simply:
    - `$ git checkout -B <my_branch>`
- When you push, push to your branch
    - `git push origin <my_branch>`
- if backend: you are advised to work isolated in the `backend` directory, which has all the files you need.
- if frontend: you are advised to work on the `frontend` directory.

## How to set up the project locally.
1. After cloning this repository.
2. Setup the Backend server(on your terminal):
    - First create a virtual environment as below
    `$ python3 -m venv venv`
    - Activate the virtual environment.
        - On Windows
        `venv\Scripts\activate`
        - On Linux
        `$ source venv/bin/activate`
    - Install the required packages.
        `$ pip install -r requirements.txt`
    - Start the server.
        `$ python3 -m manage.py runserver 8001`

3. For Frontend, Setup development server.
    - Install the app dependencies.
        `$ npm install`
    - Start the development server
        `$ npm start`
    - create an environment file
        `.env` 
    - Add the following contents to file.
        `SERVER_URL=http://127.0.0.1:8001/`

4. Go to your working directory.
    - Frontend Engineer(`frontend`)
    - Backend Engineer(`backend`)

5. Happy Hacking.