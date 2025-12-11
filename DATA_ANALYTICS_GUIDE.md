# 📊 Data Export & Analytics Guide

## Overview

The CDA Employability Platform includes comprehensive data export and analytics capabilities to help you analyze barriers to employment and segment by participant demographics.

---

## 🎯 Three Ways to Access Data

### 1. **Built-in Analytics Dashboard** (Recommended)
Real-time interactive dashboard within the platform

### 2. **Excel Export**
Comprehensive Excel workbook with multiple sheets for deeper analysis

### 3. **Direct Database Access**
Raw SQLite database for advanced users

---

## 📈 Option 1: Analytics Dashboard

### Access:
1. Login as admin
2. Click **"Analytics"** in the top navigation
3. View real-time insights

### Features:
✅ **Summary Metrics**
- Total participants
- Total sessions
- Barriers identified
- Average readiness index

✅ **Readiness Distribution**
- Category A (Job-ready)
- Category B (Developing)
- Category C (Intensive support)

✅ **Dimension Scores**
- Visual bars for all 8 dimensions
- Average scores across all participants

✅ **Demographics Breakdown**
- By Gender
- By Age Range
- By Emirate
- By Education Level

✅ **Barrier Analysis**
- Top 20 most common barriers
- Filter by dimension
- Filter by severity
- Shows occurrence count

### URL:
```
http://localhost:3000/admin/analytics
```

---

## 📥 Option 2: Excel Export

### How to Export:

#### Method A: From Analytics Dashboard
1. Go to Analytics page
2. Click **"Export to Excel"** button (top right)
3. File downloads automatically

#### Method B: Direct API Call
```bash
# Using browser
http://localhost:3000/api/analytics/export?format=excel

# Using curl
curl -o employability-data.xlsx "http://localhost:3000/api/analytics/export?format=excel"
```

### Excel File Structure:

The exported file contains **5 worksheets**:

#### Sheet 1: **Participants**
```
Columns:
- Participant ID
- First Name, Last Name
- Gender, Age Range, Emirate, Education
- Phone, Email
- Total Sessions
- Latest Session Date
- Latest Readiness Index
- Latest Category (A/B/C)
- Assigned Coach
- Created Date
```

**Use for:** Participant overview, contact management

#### Sheet 2: **Sessions**
```
Columns:
- Session ID
- Participant ID, Name, Demographics
- Session Date
- All 8 Dimension Scores
- Readiness Index
- Readiness Category
- Total Barriers
- High Severity Barriers
- Next Touchpoint
- Consent Obtained
```

**Use for:** Session analysis, readiness trends, dimension scoring

#### Sheet 3: **Barriers**
```
Columns:
- Barrier ID
- Session ID, Participant ID
- Participant Name, Demographics
- Barrier Type, Category
- Dimension
- Severity (High/Medium/Low)
- Source (auto/manual)
- Status
- Notes
- Identified Date
```

**Use for:** Detailed barrier analysis, intervention planning

#### Sheet 4: **Barrier Statistics**
```
Columns:
- Barrier Type
- Category
- Dimension
- Severity
- Total Occurrences
```

**Use for:** Identifying most common barriers, priority setting

#### Sheet 5: **Demographics**
```
Summary metrics:
- Total Participants
- Total Sessions
- Total Barriers
- Avg Readiness Index
- Gender breakdown
- Age breakdown
- Emirate breakdown
```

**Use for:** High-level reporting, presentations

---

## 📊 How to Build Filterable Dashboards

### Using Excel Pivot Tables:

#### 1. **Barrier Analysis by Demographics**

**Steps:**
1. Open the Excel export
2. Go to **"Barriers"** sheet
3. Insert → PivotTable
4. Drag fields:
   - Rows: Barrier Type
   - Columns: Gender (or Age Range, Emirate)
   - Values: Count of Barrier ID
5. Filter by Severity (High/Medium/Low)

**Result:** See which barriers are most common for each demographic group

#### 2. **Readiness by Demographics**

**Steps:**
1. Go to **"Sessions"** sheet
2. Insert → PivotTable
3. Drag fields:
   - Rows: Emirate (or Gender, Age Range)
   - Values: Average of Readiness Index
4. Add conditional formatting (green=high, red=low)

**Result:** Compare readiness levels across demographics

#### 3. **Dimension Scores by Barrier Type**

**Steps:**
1. Combine Sessions + Barriers sheets using VLOOKUP
2. Create PivotTable
3. Drag fields:
   - Rows: Barrier Type
   - Values: Average of each dimension score

**Result:** See which barriers correlate with low scores

### Using Power BI / Tableau:

#### Import Data:
1. Open Power BI / Tableau
2. Import the Excel file
3. Load all 5 sheets
4. Create relationships:
   - Participants ↔ Sessions (Participant ID)
   - Sessions ↔ Barriers (Session ID)

#### Create Visualizations:
- **Bar Charts**: Top 10 barriers
- **Heat Maps**: Barriers by emirate
- **Line Charts**: Readiness trends over time
- **Pie Charts**: Gender/age distribution
- **Scatter Plots**: Readiness vs. barrier count

---

## 🗄️ Option 3: Direct Database Access

### Database Location:
```
prisma/dev.db
```

### Access Methods:

#### A. Using Prisma Studio (Easiest)
```bash
npx prisma studio
```

Opens: http://localhost:5555

**Features:**
- Browse all tables
- Filter and sort
- Export to CSV
- Visual interface

#### B. Using DB Browser for SQLite
1. Download: https://sqlitebrowser.org/
2. Open `prisma/dev.db`
3. Run SQL queries
4. Export results

#### C. Using SQL Queries

**Example Queries:**

```sql
-- Most common barriers
SELECT 
  bb.label,
  bb.category,
  b.severity,
  COUNT(*) as occurrences
FROM Barrier b
JOIN BarrierBank bb ON b.barrierBankId = bb.id
GROUP BY bb.label, bb.category, b.severity
ORDER BY occurrences DESC
LIMIT 20;

-- Readiness by gender
SELECT 
  p.gender,
  AVG(s.readinessIndex) as avg_readiness,
  COUNT(DISTINCT p.id) as participant_count
FROM Participant p
JOIN Session s ON s.participantId = p.id
GROUP BY p.gender;

-- Barriers by emirate
SELECT 
  p.emirate,
  bb.label as barrier,
  COUNT(*) as count
FROM Participant p
JOIN Session s ON s.participantId = p.id
JOIN Barrier b ON b.sessionId = s.id
JOIN BarrierBank bb ON b.barrierBankId = bb.id
GROUP BY p.emirate, bb.label
ORDER BY p.emirate, count DESC;

-- Dimension scores by age range
SELECT 
  p.ageRange,
  AVG(s.motivationScore) as avg_motivation,
  AVG(s.careerScore) as avg_career,
  AVG(s.searchScore) as avg_search,
  AVG(s.employabilityScore) as avg_employability,
  AVG(s.learningScore) as avg_learning,
  AVG(s.financialScore) as avg_financial,
  AVG(s.resilienceScore) as avg_resilience,
  AVG(s.supportScore) as avg_support
FROM Participant p
JOIN Session s ON s.participantId = p.id
GROUP BY p.ageRange;
```

---

## 🔍 Common Analysis Scenarios

### 1. **Identify Priority Interventions**

**Question:** What are the top 5 barriers we should address first?

**Method:**
- Go to Analytics Dashboard
- Look at "Common Barriers Analysis"
- Filter by Severity = High
- Top 5 barriers with highest occurrence count

**Or in Excel:**
- Open "Barrier Statistics" sheet
- Sort by Total Occurrences (descending)
- Filter Severity = High

### 2. **Compare Demographics**

**Question:** Do certain emirates face more barriers?

**Method:**
- Export to Excel
- Go to "Barriers" sheet
- Create PivotTable:
  - Rows: Emirate
  - Values: Count of Barrier ID
  - Columns: Severity

### 3. **Track Progress Over Time**

**Question:** Is readiness improving month-over-month?

**Method:**
- Export to Excel
- Go to "Sessions" sheet
- Create PivotTable:
  - Rows: Session Date (group by month)
  - Values: Average of Readiness Index
- Create line chart

### 4. **Segment by Multiple Factors**

**Question:** Which barriers affect young females in Dubai the most?

**Method:**
- Export to Excel
- Go to "Barriers" sheet
- Filter:
  - Gender = Female
  - Age Range = 18-24
  - Emirate = Dubai
- Create PivotTable with Barrier Type

---

## 📋 Data Dictionary

### Key Fields Explained:

**Readiness Index** (0-100)
- Weighted average of all dimension scores
- Higher = more job-ready

**Readiness Category**
- A: Job-ready (75-100)
- B: Developing (50-74)
- C: Needs intensive support (0-49)

**Barrier Severity**
- High: Requires immediate intervention
- Medium: Structured support needed
- Low: Minor adjustments

**Barrier Source**
- Auto: Suggested by system based on scores
- Manual: Added by coach

**Dimension Scores** (1-7)
- 1-2: Critical gaps
- 3-4: Below average
- 5: Average
- 6-7: Strong capability

---

## 🎯 Best Practices

### For Regular Monitoring:
✅ Export data weekly
✅ Track top 10 barriers month-over-month
✅ Monitor readiness distribution changes
✅ Review demographic trends

### For Reporting:
✅ Use "Demographics" sheet for executive summaries
✅ Include barrier statistics in presentations
✅ Show readiness distribution visually
✅ Highlight intervention impact

### For Program Planning:
✅ Identify most common High severity barriers
✅ Segment by demographics for targeted programs
✅ Track which dimensions score lowest
✅ Monitor which barriers resolve vs. persist

---

## 🔐 Data Security

- Only admins can access analytics and exports
- Exports include personal data (names, phone, email)
- Store exported files securely
- Follow CDA data protection policies
- Consider anonymizing for external sharing

---

## 🆘 Troubleshooting

**Export button not working?**
- Check you're logged in as admin
- Try refreshing the page
- Check browser console for errors

**No data showing?**
- Ensure participants have completed sessions
- Check database has been seeded
- Verify sessions saved with barriers

**Prisma Studio won't open?**
- Stop dev server first
- Run `npx prisma studio` separately
- Check port 5555 isn't in use

---

## 📞 Support

For data analysis questions:
1. Review this guide
2. Check Excel sheet comments
3. Use Analytics Dashboard first
4. Export for deeper analysis

---

**The framework is now ready for comprehensive data analysis!** 🎉
