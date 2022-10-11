# Setup Instructions

## Step 1: Create a Postgres DB
- Install PostgreSQL (if not already installed)
- On the terminal, run:
```bash
psql -U postgres
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
    
    - **MacOS / Linux**:
      - `source env/bin/activate`
 
    - **Windows (with Powershell)**:
      - `.\env\Scripts\activate`
    - **Windows (with Git Bash)**:
      - `source env/Scripts/activate`

- Run `pip install -r requirements.txt` to install the required packages

  

  

## Step 3: Setup environment variables with direnv

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

- `cd` into the `django-project` folder.
- run: `python manage.py runserver`
