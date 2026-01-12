# How to Set PostgreSQL Password

## If You Don't Have a Password Set

### Method 1: Using SQL Shell (psql) - Easiest

1. **Open SQL Shell (psql)**
   - Press `Windows Key`
   - Type "SQL Shell" or "psql"
   - Click on "SQL Shell (psql)"

2. **Connect to PostgreSQL**
   - Press `Enter` for Server (default: localhost)
   - Press `Enter` for Database (default: postgres)
   - Press `Enter` for Port (default: 5432)
   - Press `Enter` for Username (default: postgres)
   - Press `Enter` for Password (if no password is set)

3. **Set the Password**
   Once connected, you'll see `postgres=#` prompt. Type:
   ```sql
   ALTER USER postgres WITH PASSWORD 'MySecurePassword123!';
   ```
   (Replace `MySecurePassword123!` with your own password)

4. **Verify**
   Type `\q` to exit, then try connecting again with your new password.

5. **Update .env File**
   Open your `.env` file and set:
   ```env
   DB_PASSWORD=MySecurePassword123!
   ```

### Method 2: Using pgAdmin (GUI)

1. **Open pgAdmin**
   - Press `Windows Key`
   - Type "pgAdmin"
   - Open pgAdmin 4

2. **Connect to Server**
   - Enter your password (or leave empty if none set)
   - Click "Save Password" if you want

3. **Set Password**
   - Expand "Login/Group Roles" in the left panel
   - Right-click on "postgres"
   - Select "Properties"
   - Go to "Definition" tab
   - Enter your new password
   - Click "Save"

### Method 3: Command Line (Advanced)

1. **Open Command Prompt as Administrator**
   - Right-click Start Menu → "Windows PowerShell (Admin)"

2. **Navigate to PostgreSQL bin folder**
   ```powershell
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
   (Replace `15` with your PostgreSQL version number)

3. **Connect and Set Password**
   ```powershell
   .\psql.exe -U postgres
   ```
   Then run:
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_password';
   \q
   ```

## Test Your Connection

After setting the password, test it:

```powershell
cd Elcandi_Website_BE
node scripts/test_db_connection.js
```

This will tell you if your credentials are working.

## Quick Fix: Try Empty Password First

If you want to test without setting a password first, try this in your `.env`:

```env
DB_PASSWORD=
```

Then run the test script. If it works, PostgreSQL is using "trust" authentication (no password required). However, **this is not secure** and you should set a password for production.

## Common Issues

### "Password authentication failed"
- You set a password but `.env` has the wrong password
- Solution: Update `DB_PASSWORD` in `.env` with the correct password

### "Role postgres does not exist"
- PostgreSQL might be installed with a different username
- Solution: Check what users exist:
  ```sql
  SELECT usename FROM pg_user;
  ```
  Then use that username in `DB_USER` in your `.env`

### "Database does not exist"
- You need to create the database first
- Solution: Run `CREATE DATABASE elcandi_db;` in psql

