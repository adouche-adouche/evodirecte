# evoDirecte 🌸 (Flower 1.0)

A modern, robust, and English-first TypeScript wrapper for the private EcoleDirecte API. Designed for Edge environments (Cloudflare Workers) with zero production dependencies.

## Key Features

- **English-First**: All API responses are transformed from franglais to clean, natural English camelCase.
- **Zero-Dependency**: Only uses native `fetch` and Web APIs. No `axios`, no Node.js built-ins.
- **Stateless Design**: Easily export and restore session state for serverless environments.
- **Full 2FA Support**: Implements the complex "Flower" authentication flow, including QCM challenges.
- **Smart Refresh**: Automatically handles token expiration using UUID and Access Token.
- **Markdown Conversion**: Built-in parser for Homework and Messaging content.
- **Automatic Data Transformation**: Flat structures, Base64 profile pictures, and normalized numbers.

## Installation

```bash
pnpm add evodirecte
```

## Quick Start

```typescript
import { evoDirecte } from 'evodirecte';

const client = new evoDirecte();

// 1. Initial Login
const loginResult = await client.login('username', 'password', 'optional-uuid');

if (loginResult.requires2FA) {
    // 2. Handle 2FA if needed
    console.log('Question:', loginResult.qcm.question);
    const answer = '...'; // Get from user
    await client.validate2FA('username', 'password', answer);
}

// 3. Use modules
const { grades } = await client.grades.getGrades();
const timetable = await client.timetable.getTimetable('2023-09-01', '2023-09-08');

// 4. Save session for later
const session = client.getSessionData();
// Store 'session' in your DB/Cookie...

// 5. Restore session later
const restoredClient = evoDirecte.fromSession(session);
```

## Modules Covered

- **Grades**: Full history, averages, and class statistics.
- **Timetable**: Weekly schedule with teacher and room details.
- **Homework**: List of tasks, detailed content (Markdown), and marking as done.
- **Messaging**: List messages, read content, and send new ones.
- **Documents**: Access to administrative and school documents.
- **School Life**: Absences, delays, and sanctions.

## License

MIT
