# Contributing to Gemini SEO 🚀

Thank you for your interest in contributing to Gemini SEO! This project aims to build the most advanced open-source multi-agent SEO analysis tool. We welcome contributions from everyone.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)

## Code of Conduct
This project and everyone participating in it is governed by a standard Open Source Code of Conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in issues and pull requests.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key

### Local Setup
1. Fork the repository and clone it to your local machine:
   ```bash
   git clone https://github.com/navidseyedain/gemini-seo.git
   cd gemini-seo
   ```

2. Set up the backend (FastAPI):
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   pip install -r requirements.txt
   
   # Copy the environment template
   cp .env.example .env
   ```
   Add your API keys to the `.env` file.

3. Set up the frontend (React + Vite):
   ```bash
   cd frontend
   npm install
   ```

4. Run the development servers:
   - Backend: `uvicorn api:app --reload --port 8005` (from root directory)
   - Frontend: `npm run dev` (from frontend directory)

## Development Workflow

### Adding a New SEO Agent
If you want to add a new analysis agent (e.g., Backlink Analyzer, Competitor Analyzer):
1. Create a new file in `agents/sub_agents/`.
2. Implement your logic using the Google GenAI SDK or other tools.
3. Update `agents/orchestrator.py` to include your new agent in the parallel `asyncio.gather` pipeline.
4. Update the frontend UI in `App.tsx` to display the new data.

### Coding Standards
- **Python**: Follow PEP 8 guidelines. Type hints are highly encouraged.
- **React/TypeScript**: Use functional components, hooks, and Tailwind CSS for styling. Ensure your components are typed properly.
- **Git**: Write clear, concise commit messages. 

## Pull Request Process
1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

Thank you for contributing!
