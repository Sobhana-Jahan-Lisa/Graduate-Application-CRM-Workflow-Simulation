# User Guide: Graduate Application CRM Workflow Simulation

## 1. Purpose

This project simulates a graduate admissions CRM workflow. It helps track applicant records, application status, missing documents, reviewer assignment, reports, data exports, and Help Desk support requests.

## 2. Dashboard

The dashboard summarizes admissions operations:

- Total applicants
- Incomplete applications
- Applications under review
- Admitted applicants
- Status pipeline
- Operational alerts

Operational alerts identify issues such as missing documents, unassigned reviewers, and unresolved high-priority Help Desk requests.

## 3. Applicant Management

Use the **Applicants** section to:

- Add a new applicant
- Edit an existing applicant
- Delete an applicant record
- Track program and term
- Update application status
- Assign a reviewer
- Mark received documents
- Add notes

### Required Documents

The prototype tracks these required documents:

- Transcript
- Statement of Purpose
- Recommendation Letters
- Resume/CV
- English Proficiency
- Application Fee

If any document is unchecked, the application appears in the incomplete applications report.

## 4. Reports

The **Reports** section includes:

- Applications by program
- Applications by status
- Incomplete applications query
- Summary CSV export

These reports simulate operational data exports commonly needed by graduate school staff.

## 5. Help Desk

The **Help Desk** section tracks user support requests from applicants, faculty reviewers, department coordinators, and graduate school staff.

Each ticket includes:

- Request title
- User type
- Priority
- Status
- Resolution notes

## 6. Exporting Data

Use:

- **Export Applicants CSV** for detailed applicant data
- **Export Summary CSV** for program and status counts

## 7. Resetting Data

Click **Reset Sample Data** to restore the original sample records. This clears any changes saved in browser localStorage.
