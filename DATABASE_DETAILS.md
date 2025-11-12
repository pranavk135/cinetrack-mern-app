# Database Details - CineTrack MERN App

## Database: MongoDB

**Connection:** Configured via environment variable `MONGO_URI`  
**Location:** `backend/server.js` (lines 22-27)  
**Connection Options:**
- `useNewUrlParser: true`
- `useUnifiedTopology: true`

---

## Collections (Tables)

### 1. **Users Collection**

**Model File:** `backend/models/User.js`  
**Collection Name:** `users` (MongoDB automatically pluralizes)

#### Schema Fields:
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | MongoDB unique identifier |
| `username` | String | ✅ | ❌ | - | User's display name |
| `email` | String | ✅ | ✅ | - | User's email (unique) |
| `password` | String | ✅ | ❌ | - | Hashed password (bcrypt) |
| `createdAt` | Date | ❌ | ❌ | Auto | Timestamp (from timestamps: true) |
| `updatedAt` | Date | ❌ | ❌ | Auto | Timestamp (from timestamps: true) |

#### Indexes:
- `email` - Unique index (prevents duplicate emails)

#### Relationships:
- **One-to-Many:** One User can have many Movies
- Referenced in: `Movie.user` field

---

### 2. **Movies Collection**

**Model File:** `backend/models/Movie.js`  
**Collection Name:** `movies` (MongoDB automatically pluralizes)

#### Schema Fields:
| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto | MongoDB unique identifier |
| `title` | String | ✅ | ❌ | - | Movie/TV show title |
| `year` | Number | ❌ | ❌ | `0` | Release year |
| `rating` | Number | ❌ | ❌ | `0` | User's rating (0-10) |
| `listName` | String | ❌ | ❌ | `"Default"` | List name (simple string, not a reference) |
| `apiId` | String | ❌ | ❌ | `null` | OMDb API ID (e.g., imdbID) |
| `poster` | String | ❌ | ❌ | `""` | Poster image URL |
| `type` | String | ❌ | ❌ | `"movie"` | Type: "movie" or "series" |
| `user` | ObjectId (ref: User) | ✅ | ❌ | - | **Reference to User** - Owner of this movie |
| `status` | String | ❌ | ❌ | `"Plan to Watch"` | Status enum: "Plan to Watch", "Watching", "Completed", "Dropped" |
| `review` | String | ❌ | ❌ | `""` | User's review text |
| `isPublic` | Boolean | ❌ | ❌ | `false` | Whether movie is visible in public lists |
| `createdAt` | Date | ❌ | ❌ | Auto | Timestamp (from timestamps: true) |
| `updatedAt` | Date | ❌ | ❌ | Auto | Timestamp (from timestamps: true) |

#### Indexes:
- `user` - Indexed for fast queries (find movies by user)

#### Relationships:
- **Many-to-One:** Many Movies belong to one User
- **Reference:** `user` field references `User._id`
- Can be populated: `Movie.find().populate("user", "username")`

#### Status Enum Values:
- `"Plan to Watch"` - User wants to watch this
- `"Watching"` - Currently watching
- `"Completed"` - Finished watching
- `"Dropped"` - Stopped watching

---

## Database Relationships

```
User (1) ────────< (Many) Movie
  │                        │
  │                        │
  └─ _id ──────────────── user (ObjectId reference)
```

**How it works:**
- Each Movie has a `user` field that stores the User's `_id`
- When querying, you can use `.populate("user")` to get full User data
- Example: `Movie.find({ user: userId })` finds all movies for a user

---

## Database Operations

### User Operations:
- **Create:** `new User({ username, email, password }).save()`
- **Find by email:** `User.findOne({ email })`
- **Find by ID:** `User.findById(id)`

### Movie Operations:
- **Create:** `new Movie({ title, user: userId, ... }).save()`
- **Find user's movies:** `Movie.find({ user: userId })`
- **Find public movies:** `Movie.find({ isPublic: true })`
- **Find with user data:** `Movie.find().populate("user", "username")`
- **Update:** `Movie.findOneAndUpdate({ _id, user }, updates)`
- **Delete:** `Movie.findOneAndDelete({ _id, user })`

---

## Environment Variables Needed

Create `.env` file in `backend/` folder:

```env
MONGO_URI=mongodb://localhost:27017/cinetrack
# OR for MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinetrack

JWT_SECRET=your-secret-key-here
OMDB_API_KEY=your-omdb-api-key
PORT=5000
```

---

## Database Structure Summary

**Total Collections:** 2
- `users` - User accounts
- `movies` - Movie/TV show entries

**Total Relationships:** 1
- User → Movies (One-to-Many)

**No Separate Collections For:**
- ❌ Lists (using simple `listName` strings instead)
- ❌ Reviews (stored as field in Movie)
- ❌ Ratings (stored as field in Movie)

---

## Example Data Structure

### User Document:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$hashedpassword...",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Movie Document:
```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "The Matrix",
  "year": 1999,
  "rating": 9,
  "listName": "Favorites",
  "apiId": "tt0133093",
  "poster": "https://example.com/poster.jpg",
  "type": "movie",
  "user": "507f1f77bcf86cd799439011",
  "status": "Completed",
  "review": "Amazing sci-fi classic!",
  "isPublic": true,
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

## Notes

1. **List Management:** Lists are NOT separate collections. They're just string names stored in `Movie.listName`. This keeps it simple!

2. **Public Lists:** Movies with `isPublic: true` can be viewed by anyone in the Public Explorer.

3. **User Isolation:** Each user can only see/edit their own movies (enforced by `user` field in queries).

4. **Password Security:** Passwords are hashed using bcrypt before storage (never stored as plain text).

5. **Timestamps:** Both collections automatically track `createdAt` and `updatedAt` timestamps.

