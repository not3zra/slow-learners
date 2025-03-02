## **User API Documentation**

### **Base URL**
```
http://localhost:5000/api/users
```

---

## **1️⃣ User Signup**
**Endpoint:** `POST /signup`  
**Description:** Registers a new user.  

**Request Body (JSON):**  
```json
{
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "password": "password123",
    "role": "student",
    "registerNumber": "REG12345",
    "programme": "MCA"
}
```
- If **role = "student"**, `registerNumber` and `programme` are required.  
- If **role = "teacher"**, `subjectsTeaching` will be added later via profile update.  

**Response (Success - 201 Created):**  
```json
{
    "message": "User registered successfully"
}
```
**Response (Error - 400 Bad Request):**  
```json
{
    "message": "User already exists"
}
```

---

## **2️⃣ User Login**
**Endpoint:** `POST /login`  
**Description:** Logs in a user.  

**Request Body (JSON):**  
```json
{
    "email": "johndoe@gmail.com",
    "password": "password123"
}
```
**Response (Success - 200 OK):**  
```json
{
    "message": "Login successful",
    "user": {
        "id": "65abcd1234ef5678",
        "role": "student"
    }
}
```
**Response (Error - 400 Bad Request):**  
```json
{
    "message": "Invalid email or password"
}
```

---

## **3️⃣ User Logout**
**Endpoint:** `POST /logout`  
**Description:** Logs out the user.  

**Response (Success - 200 OK):**  
```json
{
    "message": "Logged out successfully"
}
```


# **Classroom API Documentation**

## **Base URL**
```
http://localhost:5000/api/classrooms
```
---

## **1️⃣ Get All Classrooms**
- **Endpoint:** `GET /list`  
- **Description:** Fetches a list of all classrooms.  

### **Response (Success - 200 OK)**
```json
[
    {
        "_id": "65f123abc456def789000111",
        "name": "Room A101",
        "capacity": 30,
        "__v": 0
    },
    {
        "_id": "65f123abc456def789000222",
        "name": "Room B202",
        "capacity": 25
    }
]
```

### **Response (Error - 500 Server Error)**
```json
{
    "message": "Server Error",
    "error": "Error details here"
}
```

---

## **2️⃣ Add a New Classroom**
- **Endpoint:** `POST /add`  
- **Description:** Adds a new classroom.  

### **Request Body (JSON)**
```json
{
    "name": "Room A101",
    "capacity": 30
}
```

### **Response (Success - 200 OK)**
```json
{
    "message": "Classroom added successfully"
}
```

### **Response (Error - 500 Server Error)**
```json
{
    "message": "Server Error",
    "error": "Error details here"
}
```


