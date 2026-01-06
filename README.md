Signature Gap – Frontend

Signature Gap is an AI-powered legal literacy platform that helps users understand legal documents before they sign.

This repository contains the frontend (React + Vite) for the Signature Gap MVP.

🚀 Problem Statement

In emerging economies, millions of people sign legally binding documents they cannot fully read or understand due to:

Complex legal language

Lack of affordable legal assistance

Language barriers

This gap between signing and understanding is what we call the Signature Gap.

💡 Solution Overview

Signature Gap helps users make informed decisions by analyzing legal documents and presenting insights in a simple, accessible way.

The platform:

Extracts text from legal documents

Identifies risky clauses

Explains implications in plain language

Offers multilingual audio summaries

Allows users to compare documents before signing

This frontend connects to an AI-powered backend that performs OCR, analysis, and translation.

🧩 Key Features (Frontend MVP)

📄 Upload legal documents (PDF / scanned images)

🔒 Privacy masking step before analysis

⚙️ Processing screen with clear loading state

📊 Risk summary with highlighted clauses

🔊 Audio summary (English & Indian regional languages)

📥 Downloadable risk summary

🔁 Compare two documents (MVP-level comparison)

🎨 Clean, minimal UI using reusable styles

🛠️ Tech Stack

React.js

Vite

JavaScript (ES6)

Inline reusable UI styles (no Tailwind)

Browser Text-to-Speech API

🗂️ Project Structure
src/
├── pages/
│   ├── Upload.jsx
│   ├── Mask.jsx
│   ├── Processing.jsx
│   ├── Result.jsx
│   └── Compare.jsx
├── styles/
│   └── ui.js
├── components/
│   └── Card.jsx
└── App.jsx

🔗 Backend Integration

The frontend communicates with a deployed backend service that provides:

OCR processing for scanned documents

AI-based legal contract analysis

Risk scoring and clause explanations

Translation support for Indian regional languages

Backend and frontend are connected via REST APIs.

🧪 MVP Status

✅ Frontend flow complete
✅ All UI screens implemented
✅ Backend integration wired
✅ End-to-end user journey demonstrated

This repository represents the frontend MVP submission for the Signature Gap project.

⚠️ Disclaimer

Signature Gap provides legal literacy and educational insights only.
It does not replace professional legal advice.

👩‍💻 Author

Frontend developed by Neha Gopalakrishnan
As part of a hackathon project on AI-powered legal accessibility.
