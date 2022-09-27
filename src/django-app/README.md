# Setup Instructions

## Step 1: Create a Postgres DB
- Install PostgreSQL (if not already installed)
- On the terminal, run:
```bash
psql
```
```bash
CREATE DATABASE sayyara;
```

```
CREATE USER my_username WITH PASSWORD 'my_password';
```

```
GRANT ALL PRIVILEGES ON DATABASE sayyara TO my_username;
```

Note: you can keep any name for your database, username and password.



## Step 2: Install Python Packages

- Create a virtual env:

  - Run:

    - `pip3 install virtualenv`

    - `virtualenv env`
    - `source env/bin/activate`

- Run `pip install -r requirements.txt` to install the required packages

  

  

## Step 3: Setup environment variables with direnv

- Install `direnv`

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

- `cd` into the `django-project` folder.
- run: `python manage.py runserver`
