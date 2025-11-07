import { createFileRoute } from '@tanstack/react-router'
import { validateCsrfRequest, createCsrfErrorResponse, ensureCsrfToken } from '@/lib/csrf-protection'

const todos = [
  {
    id: 1,
    name: 'Buy groceries',
  },
  {
    id: 2,
    name: 'Buy mobile phone',
  },
  {
    id: 3,
    name: 'Buy laptop',
  },
]

export const Route = createFileRoute('/demo/api/tq-todos')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const response = Response.json(todos)
        // Ensure CSRF token exists on GET response
        return ensureCsrfToken(response)
      },
      POST: async ({ request }) => {
        // CSRF Protection: POST method requires CSRF token validation
        const validation = validateCsrfRequest(request)
        if (!validation.valid) {
          console.warn('[CSRF] Validation failed for /demo/api/tq-todos:', validation.error)
          return createCsrfErrorResponse(validation.error!)
        }

        const name = await request.json()
        const todo = {
          id: todos.length + 1,
          name,
        }
        todos.push(todo)
        return Response.json(todo)
      },
    },
  },
})
