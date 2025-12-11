# Admin Panel & Bulk Import Guide

## Overview

The admin panel allows authorized users to:
- View dashboard statistics
- Bulk import participants via Excel/CSV upload
- Monitor recent additions
- Manage the participant database

## Access

### Login Credentials
- **URL**: http://localhost:3000/admin/login
- **Default Password**: `admin123`

### Changing the Password

Edit the `.env` file:
```env
ADMIN_PASSWORD="your_secure_password_here"
```

Then restart the server:
```cmd
npm run dev
```

⚠️ **Important**: Change the default password before deploying to production!

## Admin Dashboard Features

### 1. Statistics Overview

The dashboard displays:
- **Total Participants**: All participants in the system
- **Assessed**: Participants who have completed sessions
- **Not Assessed**: Participants awaiting assessment
- **Total Sessions**: Number of coaching sessions conducted
- **Barriers Identified**: Total employment barriers logged

### 2. Bulk Import Participants

Upload an Excel or CSV file to import multiple participants at once.

#### Excel Template

Download the template from the dashboard to get the correct format.

**Required Columns:**
- `firstName` - Participant's first name
- `lastName` - Participant's last name
- `gender` - Must be: Male, Female, or Other
- `ageRange` - Must be: 18-24, 25-29, 30-34, 35-39, 40-44, 45-49, or 50+
- `education` - Must be: High School, Diploma, Bachelor's Degree, Master's Degree, PhD, or Other
- `emirate` - Must be: Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, or Fujairah

**Optional Columns:**
- `phone` - Contact phone number
- `email` - Email address (must be valid format)

#### Example Excel File

| firstName | lastName   | gender | ageRange | education           | emirate  | phone          | email              |
|-----------|------------|--------|----------|---------------------|----------|----------------|--------------------|
| Ahmed     | Al Mansoori| Male   | 25-29    | Bachelor's Degree   | Dubai    | +971501234567  | ahmed@example.com  |
| Fatima    | Al Mazrouei| Female | 30-34    | Master's Degree     | Abu Dhabi| +971509876543  | fatima@example.com |
| Mohammed  | Al Hashimi | Male   | 18-24    | High School         | Sharjah  |                | mohammed@example.com|

#### Upload Process

1. **Prepare your Excel file** following the template format
2. **Click "Select Excel File"** and choose your file
3. **Click "Upload & Import"**
4. **Review the results**:
   - ✅ Success: Shows how many participants were imported
   - ❌ Error: Shows validation errors with row numbers

#### Validation Rules

The system validates:
- ✅ All required fields are present and not empty
- ✅ Gender matches allowed values
- ✅ Age range matches allowed values
- ✅ Education matches allowed values
- ✅ Emirate matches allowed values
- ✅ Email format is valid (if provided)
- ✅ No duplicate entries

**If validation fails**, the import is rejected and you'll see:
- Row number with the error
- Field name that failed
- Error description

**Fix the errors in your Excel file and try again.**

### 3. Recent Participants View

Shows the 10 most recently added participants with:
- Name
- Gender
- Emirate
- Date added
- Quick link to view/assess

## Common Scenarios

### Scenario 1: Import 50 New Participants

1. Download the template
2. Fill in all 50 rows with participant data
3. Save as Excel (.xlsx) or CSV
4. Upload through admin dashboard
5. System validates all rows
6. If successful, all 50 are imported instantly
7. Navigate to "View Participants" to see them

### Scenario 2: Handle Validation Errors

Upload attempt fails with errors:
```
Row 5 - ageRange: Age range must be one of: 18-24, 25-29, 30-34...
Row 12 - email: Invalid email format
Row 23 - firstName: First name is required
```

**Solution:**
1. Open your Excel file
2. Go to row 5 and fix the age range
3. Go to row 12 and correct the email
4. Go to row 23 and add the missing first name
5. Save and re-upload

### Scenario 3: Partial Import

If you have 100 rows and 5 have errors:
- ❌ Import is rejected (nothing is imported)
- ✅ Fix the 5 errors
- ✅ Re-upload (all 100 will import)

**The system is all-or-nothing to prevent partial data.**

## Security Best Practices

### Production Deployment

1. **Change Default Password**
   ```env
   ADMIN_PASSWORD="ComplexPassword123!@#"
   ```

2. **Use HTTPS** - Never use admin panel over HTTP in production

3. **Restrict Access** - Consider IP whitelisting for admin routes

4. **Regular Password Changes** - Update admin password monthly

5. **Audit Logs** - Monitor admin activities (future enhancement)

### Cookie Security

The system uses:
- HttpOnly cookies (can't be accessed via JavaScript)
- 24-hour session expiration
- Secure flag in production
- SameSite protection

## API Endpoints

For programmatic access (future integration):

### Login
```
POST /api/admin/login
Body: { "password": "admin123" }
Response: { "success": true }
```

### Logout
```
POST /api/admin/logout
Response: { "success": true }
```

### Upload
```
POST /api/admin/upload
Body: FormData with 'file' field
Response: { "success": true, "imported": 50, "total": 50 }
```

## Troubleshooting

### Issue: "Invalid password"
**Solution:** Check your .env file for the correct ADMIN_PASSWORD

### Issue: Excel upload fails with "No file uploaded"
**Solution:** Make sure you selected a file before clicking upload

### Issue: All rows fail validation
**Solution:** Check that your column headers exactly match the template:
- firstName (not First Name)
- lastName (not Last Name)
- ageRange (not Age Range)
- etc.

### Issue: Session expired
**Solution:** Sessions last 24 hours. Re-login at /admin/login

### Issue: Can't access admin pages
**Solution:** Make sure you're logged in first at /admin/login

## Excel Tips

### Create Perfect Excel Files

1. **Use the template** - Download from dashboard
2. **Don't add extra columns** - Stick to the template
3. **No empty rows** - Remove blank rows between data
4. **Consistent formatting** - Same format for all entries
5. **Text format for phone numbers** - Prevents Excel from removing leading zeros

### Converting from Other Formats

**From Google Sheets:**
1. File → Download → Microsoft Excel (.xlsx)
2. Upload the downloaded file

**From CSV:**
- CSV files work directly (no conversion needed)

**From PDF:**
- Convert to Excel first using online tools
- Verify data integrity after conversion

## Future Enhancements

Planned features for admin panel:
- [ ] Bulk edit participants
- [ ] Bulk delete participants
- [ ] Export filtered data
- [ ] User activity logs
- [ ] Multiple admin accounts
- [ ] Role-based permissions
- [ ] Participant search and filters
- [ ] Batch session scheduling

## Support

For issues with admin features:
1. Check this documentation
2. Verify your Excel file format matches template
3. Check browser console for errors (F12)
4. Review server logs in terminal

---

**Quick Access:**
- Admin Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin/dashboard
- Participants: http://localhost:3000/participants
