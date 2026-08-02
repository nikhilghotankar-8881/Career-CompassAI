# rules.md

# OneStop AI - Development Rules & Engineering Guidelines

Version: 1.0

---

# Purpose

This document defines the development rules, coding standards, AI boundaries, libraries, error handling practices, security guidelines, and project conventions for the OneStop AI project.

Every contributor should follow these rules to keep the codebase clean, maintainable, secure, and scalable.

---

# 1. General Development Rules

## DO

- Write clean, readable, and modular code.
- Follow SOLID principles.
- Keep functions small and focused on one responsibility.
- Use meaningful variable and function names.
- Reuse components instead of duplicating code.
- Write comments only where business logic is complex.
- Keep business logic separate from UI.
- Commit small and meaningful changes.
- Test every feature before merging.
- Update documentation when adding new features.

---

## DON'T

- Do not write large files with multiple responsibilities.
- Do not duplicate code.
- Do not hardcode API keys or secrets.
- Do not commit `.env` files.
- Do not ignore errors silently.
- Do not use unnecessary libraries.
- Do not bypass authentication checks.
- Do not leave unused code in the repository.
- Do not merge untested code.

---

# 2. Folder Rules

Every folder has a single responsibility.

Frontend

components/
→ Reusable UI only

pages/
→ Page-level components

services/
→ API calls only

hooks/
→ Custom React hooks

utils/
→ Helper functions

types/
→ TypeScript interfaces

Backend

api/
→ API routes only

services/
→ Business logic

database/
→ Database configuration and models

schemas/
→ Request and response validation

core/
→ Security, configuration, authentication

utils/
→ Shared helper functions

---

# 3. Naming Convention

Files

✅ user_service.py

✅ recommendation_service.py

❌ UserServiceFinal.py

Functions

✅ get_user_profile()

✅ create_assessment()

❌ DoEverything()

Variables

✅ career_score

✅ user_profile

❌ x

❌ temp

Classes

PascalCase

Example

CareerRecommendationService

ResumeAnalyzer

---

# 4. Technology Rules

Frontend

Allowed

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query

Avoid

- jQuery
- Inline CSS
- Multiple UI frameworks
- Large unnecessary npm packages

---

Backend

Allowed

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT
- bcrypt

Avoid

- Flask
- Django
- Mixing multiple backend frameworks
- Raw SQL when ORM is sufficient

---

Database

Allowed

- PostgreSQL

Avoid

- Multiple databases
- Hardcoded SQL queries
- Duplicate tables

---

AI

Allowed

- OpenAI API
- Prompt Templates
- Embeddings
- Retrieval-Augmented Generation (RAG)

Avoid

- Giving AI unrestricted database access
- Sending sensitive user data without necessity
- Blindly trusting AI output
- Executing AI-generated code automatically

---

# 5. Error Handling

Always

- Validate user input.
- Catch expected exceptions.
- Return meaningful error messages.
- Log server-side errors.
- Show user-friendly messages.

Never

- Display stack traces to users.
- Ignore exceptions.
- Return raw database errors.
- Expose internal API details.

Example

Bad

500 Error

Good

{
  "message": "Unable to generate career recommendation. Please try again."
}

---

# 6. Logging Rules

Log

- Login attempts
- API failures
- AI failures
- File uploads
- Authentication errors

Do Not Log

- Passwords
- JWT tokens
- API keys
- Personal documents
- Resume content

---

# 7. Security Rules

Always

- Hash passwords using bcrypt.
- Use JWT authentication.
- Validate every request.
- Sanitize all user input.
- Use HTTPS.
- Store secrets in environment variables.
- Enable CORS correctly.

Never

- Store passwords in plain text.
- Commit API keys.
- Trust frontend validation alone.
- Return sensitive information in API responses.

---

# 8. AI Boundaries

The AI Assistant MAY

- Recommend careers.
- Suggest learning paths.
- Analyze resumes.
- Answer education-related questions.
- Recommend certifications.
- Explain technologies.
- Generate personalized roadmaps.

The AI Assistant MUST NOT

- Guarantee job placement.
- Promise admission to colleges.
- Predict salaries with certainty.
- Replace professional career counselors.
- Generate fake certificates.
- Fabricate scholarship information.
- Make final legal, financial, or medical decisions.

Every AI recommendation should include a disclaimer that it is guidance, not a guaranteed outcome.

---

# 9. Validation Rules

Frontend

Validate

- Email
- Password strength
- Required fields
- File type
- File size

Backend

Validate

- Request body
- JWT token
- File uploads
- User permissions
- API payloads

---

# 10. File Upload Rules

Allowed

- PDF
- DOCX

Maximum Size

10 MB

Reject

- Executable files
- Scripts
- Unsupported formats

---

# 11. API Rules

Every endpoint should

- Validate input
- Authenticate user when required
- Return proper HTTP status codes
- Return JSON responses
- Handle exceptions gracefully

Status Codes

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error

---

# 12. Git Rules

Commit Messages

Good

feat: add career assessment module

fix: resolve login validation bug

docs: update architecture documentation

refactor: simplify recommendation service

Avoid

update

changes

final

latest

---

# 13. Performance Rules

Always

- Lazy load pages.
- Optimize database queries.
- Cache frequently accessed data.
- Paginate large datasets.
- Compress images.
- Optimize API responses.

Avoid

- N+1 queries
- Unnecessary API calls
- Large bundle sizes
- Duplicate database requests

---

# 14. Code Review Checklist

Before merging

- Code builds successfully
- No linting errors
- No console logs
- Tests pass
- Documentation updated
- Naming conventions followed
- Security rules followed

---

# 15. Documentation Rules

Every new feature should include

- Description
- API documentation
- Database changes
- Screenshots (if UI changes)
- Testing notes

---

# 16. Future Expansion Rules

New features must

- Be modular
- Avoid breaking existing APIs
- Follow folder structure
- Follow naming conventions
- Include tests
- Update documentation

---

# 17. Definition of Done

A task is considered complete only if

- Feature is implemented
- Code reviewed
- Tested successfully
- No critical bugs
- Documentation updated
- Git committed
- Ready for deployment

---

# Final Principle

> Build software that is simple to understand, easy to maintain, secure by design, and scalable for future growth.

Every line of code should improve the project—not make it more complex.