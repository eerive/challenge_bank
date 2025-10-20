# Fast & Reckless Bank 

## Setup & Running

### Prerequisites
- Java 25
- Node.js 20+ and Yarn
- Gradle (included via wrapper)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd /Users/mdlam/development/bank
   ```

2. Build the project:
   ```bash
   ./gradlew clean build
   ```

3. Run the application:
   ```bash
   ./gradlew bootRun
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd bank-fe
   ```

2. Install dependencies (first time only):
   ```bash
   yarn install
   ```

3. Run the development server:
   ```bash
   yarn dev
   ```

The frontend will start on `http://localhost:5173`
