# API contracts — Codebase Intelligence

_Derived from source. See root `API.md` and each subproject README._

## MCP tools
- `search_code`
- `ask_codebase`
- `get_related_files`

## Web HTTP API
- `POST /api/ask`
- `POST /api/index`

> Inputs are validated; errors return `{ error: { message } }` with an appropriate status.
