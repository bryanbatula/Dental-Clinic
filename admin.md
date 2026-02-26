# Admin Credentials Guide

This guide walks you through how to change the admin **username** and **password** step by step.

---

## Files You Will Edit

Both scripts are located in the `scripts/` folder:

| Script | Purpose |
|---|---|
| `scripts/updateUsername.js` | Change the admin username |
| `scripts/seedAdmin.js` | Reset or re-seed the admin user with a new password |

---

## How to Change the Username

### Step 1 — Open `scripts/updateUsername.js`

You will see this section:

```js
const result = await pool.query(
  'UPDATE users SET username = $1 WHERE username = $2',
  ['DENTAL', 'DENTAL CLINIC']   // ['NEW USERNAME', 'CURRENT USERNAME']
);
```

### Step 2 — Edit the values

- **First value** → the **new** username you want to set
- **Second value** → the **current** username already in the database

Example — changing from `DENTAL` to `MY CLINIC`:

```js
['MY CLINIC', 'DENTAL']
```

### Step 3 — Update the log message (optional but recommended)

Change the console log below the query to match your new values so the output is accurate:

```js
console.log('Username updated successfully from "DENTAL" to "MY CLINIC"');
```

### Step 4 — Run the script

Open a terminal at the project root and run:

```bash
node scripts/updateUsername.js
```

### Expected output

```
Successfully connected to the database
Username updated successfully from "DENTAL" to "MY CLINIC"
1 row(s) affected
```

If you see `0 row(s) affected`, the current username you entered in Step 2 did not match what is stored in the database. Double-check the current username and try again.

---

## How to Change the Password

### Step 1 — Open `scripts/seedAdmin.js`

You will see this section:

```js
const username = 'DINDENTAL';
const password = 'admin123';
```

### Step 2 — Edit the values

- Change `username` to your desired admin username
- Change `password` to your desired new password

Example:

```js
const username = 'MY CLINIC';
const password = 'newpassword123';
```

> The password will be automatically hashed with bcrypt before being saved — you do not need to hash it manually.

### Step 3 — Run the script

```bash
node scripts/seedAdmin.js
```

### Expected output

```
Successfully connected to the database
Admin user seeded successfully.
```

> **Note:** This script uses `ON CONFLICT (username) DO NOTHING`, meaning it will **only insert** if the username does not already exist. If the user already exists, nothing will change.
>
> If you want to **update the password of an existing user**, you will need to either:
> - Delete the existing user from the database first, then re-run the seed, or
> - Manually update the password hash directly in the database.

---

## Quick Reference

| Task | File to edit | Command to run |
|---|---|---|
| Change username | `scripts/updateUsername.js` | `node scripts/updateUsername.js` |
| Set new admin / reset password | `scripts/seedAdmin.js` | `node scripts/seedAdmin.js` |

---

## Current Credentials (as of last update)

| Field | Value |
|---|---|
| Username | `DENTAL` |
| Password | `admin123` |

> Update this table whenever you change your credentials.
