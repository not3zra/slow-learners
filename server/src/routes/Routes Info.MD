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

---

### **📌 Notes**
- **All requests should use `application/json` format.**  
- **Teachers will be able to update subjects later once `edit-profile` is implemented.**  
- **Students cannot update register number or programme.**  

---

