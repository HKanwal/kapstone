# Project Name Source Code

The folders and files for this project are as follows:

...

# Requirements

- nodejs (nvm recommended)
- npm
- python (version 3.8 or higher)
- pip

# Recommended dev setup

VSCode is the recommended editor.
Install the following extensions:

- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Set the following VSCode settings related to formatting:

```json
"editor.formatOnSave": true,
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.tabSize": 2,
"prettier.jsxBracketSameLine": true,
"prettier.singleQuote": true,
"prettier.printWidth": 100
```

# Development

To have Nextjs work with Django, we will need to have two servers running. One Nextjs
server and the public facing Django server which will query the Nextjs server internally.

## Install and run Nextjs server

1. Enter Nextjs directory: `cd src/next-app`
2. Install npm dependencies: `npm install`
3. Run development server: `npm run dev`

This will run the Nextjs server on localhost:3000

## Install and run Django server

1. Enter Django directory: `cd src/django_server`
2. Install pip dependencies: `python -m pip install -r requirements.txt`
3. Run development server: `python manage.py runserver`

This will run the Django server on localhost:8000.

# Resources

- Nextjs + Django guide: https://medium.com/@danialkeimasi/django-next-js-the-easy-way-655efb6d28e1
- Django-Nextjs library: https://github.com/QueraTeam/django-nextjs
- Django docs: https://docs.djangoproject.com/en/4.1/
- Nextjs docs: https://nextjs.org/docs/getting-started
