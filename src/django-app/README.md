# Setup Instructions

## Step 1: Create a Postgres DB
- Install PostgreSQL (if not already installed)

- On the terminal, run:

##### Step 1:
```bash
psql -U postgres
```
##### Step 2:
```bash
CREATE DATABASE sayyara;
```

##### Step 3 (Optional: Use this to create a custom User):
```
CREATE USER my_username WITH PASSWORD 'my_password';
```
##### Step 4 (Optional: Use this if you followed Step 3):
```
GRANT ALL PRIVILEGES ON DATABASE sayyara TO my_username;
```

*Note: you can keep any name for your database, username and password. You can skip Step 3 below if you did not create a custom User above.*



## Step 2: Install Python Packages

- Create a virtual env:

  - Run:
    - `pip3 install virtualenv`
    

    - `virtualenv env`
    
    - **MacOS / Linux**:
      - `source env/bin/activate`

    - **Windows (with Powershell)**:
      - `.\env\Scripts\activate`
    - **Windows (with Git Bash)**:
      - `source env/Scripts/activate`

- Run `pip install -r requirements.txt` to install the required packages

  

  

## Step 3 (Optional): Setup environment variables with direnv

#### You may follow the instructions below to define a custom user on the database (This step is optional if you are using default postgres settings)

- Install `direnv`
  - **MacOS**: 
    - `brew install direnv`
  - **Windows (using git bash)**:
    - Download [direnv.windows-amd64.exe](https://github.com/direnv/direnv/releases/download/v2.32.1/direnv.windows-amd64.exe).
    - Move `direnv.windows-amd64.exe` to `C:\Program Files\Git\usr\bin`.
    - Add the following lines to your `.bashrc` file (if you haven't made one, create the file under your home folder):
      - `alias direnv="/usr/bin/direnv.windows-amd64.exe"`
      - `eval "$(direnv hook bash)"`
      - Launch git bash and ensure `direnv` is installed correctly by executing `direnv --version`. Note that this method will not work if you are using powershell.

- Create a file in the `django-app` directory called `.envrc`.

- In the `.envrc` file, define the following environment variables with the username/password you used above:

  ```bash
  export DB_NAME="sayyara"
  export DB_USER="my_username"
  export DB_PASSWORD="my_password"
  export DB_HOST="localhost"
  export DB_PORT="5432"
  ```

- Run `direnv allow` to allow the new env variables.



## Step 4: Run the Django App

- run: `python manage.py runserver`





# API Endpoints:

API Endpoints can ve viewed with the Swagger UI at http://localhost:8000/docs.

They can also be viewed with Redoc's UI at http://localhost:8000/redocs.

A few of the endpoints are listed below.

### Create User

- **Request Type**: POST

- **Request URL**: http://localhost:8000/auth/users/

- **Headers**:

  - *Content-Type*: application/json

- **Body**:

  - ```json
    {
        "email": "EMAIL ADDRESS (UNIQUE)",
        "username": "USERNAME (Case Sensitive)",
        "password": "PASSWORD",
        "re_password": "RE-ENTER PASSWORD",
        "first_name": "FIRST NAME (Optional)",
        "last_name": "LAST NAME (Optional)",
        "type": "ONE OF: shop_owner, employee or customer (DEFAULT = customer)"
    }
    ```



### Create JWT Token (aka Login)

- **Request Type**: POST

- **Request URL**: http://localhost:8000/auth/jwt/create/

- **Headers**:

  - *Content-Type*: application/json

- **Body**:

  - ```json
    {
        "username": "USERNAME",
        "password": "PASSWORD"
    }
    ```



### Refresh JWT Token

- **Request Type**: POST

- **Request URL**: http://localhost:8000/auth/jwt/refresh/

- **Headers**:

  - *Content-Type*: application/json

- **Body**:

  - ```json
    {
        "refresh": "REFRESH_TOKEN"
    }
    ```



### Delete JWT Token (aka Logout)

- **Request Type**: DELETE

- **Request URL**: http://localhost:8000/auth/users/me

- **Headers**:

  - *Content-Type*: application/json
  - *Authorization*: JWT {INSERT ACCESS TOKEN HERE}

- **Body**:

  - ```json
    {
        "current_password": "PASSWORD"
    }
    ```

### Create Shop

- **Request Type**: POST

- **Request URL**: http://localhost:8000/shops/shops

- **Headers**:

  - *Content-Type*: application/json

- **Body**:

  - ```json
    {
        "shop_owner": "SHOP OWNER (Model)",
        "address": "ADDRESS (Model)",
        "name": "SHOP NAME",
        "num_bays": "NUMBER OF SERVICE BAYS (Optional)",
        "availability": "AVAILABILITY (Optional)",
        "shop_hours": "SHOP HOURS (Optional)"
    }
    ```


