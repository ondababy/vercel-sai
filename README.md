User’s Manual 

1. Accessing the Project
- Open Visual Studio Code and navigate to the project directory.

2. Frontend Setup
- Open a terminal, then navigate to the frontend folder: cd path/to/frontend
- Install dependencies: npm install
- Run the development server: npm run dev

3. Backend Setup
- Open a new terminal, then navigate to the backend folder: cd path/to/backend
- Create a virtual environment: python -m venv venv
- Activate the virtual environment:
	- Windows: venv\Scripts\activate
	- Mac/Linux: source venv/bin/activate
- Install required packages:
	- pip install asgiref Django django-cors-headers djangorestframework 	djangorestframework-simplejwt PyJWT pytz sqlparse python-dotenv 	cryptography diffprivlib pycryptodome
- Run database migrations: python manage.py migrate
- Start the backend server: python manage.py runserver

4. Login & Sign
- Click on "Start Writing Now" to create notes
- Register by filling out username, email, and password
- After the successful registration, login with the correct username and password

5. User Interface
- Dashboard
	- Overview of Charts and Differential Analytics
	- Export and Download a copy of the current report
- Tap the “Notes” at the header
	- Click on "Create Note" and “Edit” to start creating/editing content
	-  Type in the search bar the note title you want to find

6. Admin Interface
	- Dashboard: Overview of Charts and Differential Analytics
	- Users List: View the encrypted list of users
	- Notes List: View the encrypted list of notes