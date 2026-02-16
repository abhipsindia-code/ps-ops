# PS Ops Platform

## Current Status
- Admin Dashboard ✅
- Assign Work Order flow ✅
- In-memory jobs (mock DB) ✅

## Core Data Models
### Job
- id
- code
- title
- status
- supervisor
- team
- history

## APIs
### GET /api/jobs
### POST /api/jobs/assign
Payload:
- jobIds
- supervisorId
- supervisorName
- technicianIds
