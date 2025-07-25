# User Prompts and Guidance

This file contains all the prompts and guidance provided during our conversation.

## Earlier Project Context

Based on the files in the project, there was an earlier conversation about building a Discogs clone application. This resulted in:

1. **Development Plan Creation**: A comprehensive 16-week development plan was created (stored in memory/discogs-clone-plan.md) that outlines:
   - Building a music database and marketplace application
   - Using React, TypeScript, PostgreSQL, and other modern technologies
   - 8 development phases from foundation to production
   - Detailed technical architecture and data models

2. **Initial Implementation**: The project was started with:
   - Backend setup with Express.js, Prisma, and PostgreSQL
   - Frontend with React, TypeScript, and Vite
   - Authentication system implementation
   - Basic database schema for users, artists, releases, etc.

## Current Conversation History

### 1. Initial Request - Website Screenshot
**Prompt:** "Navigate to discogs.com, take a screenshot, and describe to me what you see."

**Context:** User requested navigation to Discogs.com to capture and analyze the website.

### 2. Localhost Application Review
**Prompt:** "can you look at the localhost:5173 and describe it"

**Context:** User wanted to see what application was running on their local development server.

### 3. MCP Project Location
**Prompt:** "Where is the MCP project stored?"

**Context:** User needed to know the location of the MCP (Model Context Protocol) project in their codebase.

### 4. GitHub Project Naming
**Prompt:** "what should i call the project on github"

**Context:** User was looking for suggestions on naming their GitHub repository.

### 5. Marketable Name Request
**Prompt:** "come up with a marketable, catchy name"

**Context:** User wanted creative, marketable names for their project.

### 6. MCP Server Specific Naming
**Prompt:** "create a marketable name that's catchy for the MCP server browser screenshot"

**Context:** User specifically wanted a catchy, marketable name for the MCP browser screenshot server component.

### 7. Documentation Request
**Prompt:** "Create a file that has all the prompts and guidance I provided to you so far."

**Context:** User requested documentation of all their prompts and guidance from the conversation.

## Project Context

- Working on a Discogs clone application (music collection management system)
- Has an MCP browser screenshot server component
- Running locally on localhost:5173
- Looking to publish on GitHub with a marketable name
- Interested in separating or combining the projects appropriately

## Key Decisions Made

1. Explored Discogs.com to understand the reference site
2. Reviewed the local application (Discogs Clone)
3. Located MCP project at `/Users/seabassgonzalez/Development/claude_code_demo/mcp-browser-screenshot/`
4. Suggested various naming options for both components
5. Recommended "PixelPeek" as the top choice for the MCP browser screenshot server

1. Start your backend server: cd backend && npm run dev
  2. Start your frontend server: cd frontend && npm run dev
  3. Visit http://localhost:5173
  4. Click "Register" to create a new account
  5. After registration, you'll be logged in automatically
  6. Try logging out and logging back in
  7. The dashboard at /home is protected and requires authentication

  The authentication system is fully functional with JWT tokens, form
  validation, error handling, and a clean user experience that matches the
  Discogs design aesthetic.