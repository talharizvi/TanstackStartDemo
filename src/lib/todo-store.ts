import { Store } from '@tanstack/store'

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  archived: boolean
  createdAt: number
  updatedAt: number
}

interface TodoState {
  todos: Todo[]
}

const STORAGE_KEY = 'tanstack-todos'

// Load todos from localStorage
function loadTodosFromStorage(): Todo[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error)
    return []
  }
}

// Save todos to localStorage
function saveTodosToStorage(todos: Todo[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error)
  }
}

// Initialize store with todos from localStorage
export const todoStore = new Store<TodoState>({
  todos: loadTodosFromStorage(),
})

// Subscribe to changes and save to localStorage
todoStore.subscribe(() => {
  const state = todoStore.state
  saveTodosToStorage(state.todos)
})

// Actions
export const todoActions = {
  createTodo: (title: string, description?: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    todoStore.setState((state) => ({
      todos: [...state.todos, newTodo],
    }))
  },

  updateTodo: (
    id: string,
    updates: Partial<Pick<Todo, 'title' | 'description'>>,
  ) => {
    todoStore.setState((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates, updatedAt: Date.now() } : todo,
      ),
    }))
  },

  toggleComplete: (id: string) => {
    todoStore.setState((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo,
      ),
    }))
  },

  deleteTodo: (id: string) => {
    todoStore.setState((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }))
  },

  toggleArchive: (id: string) => {
    todoStore.setState((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, archived: !todo.archived, updatedAt: Date.now() }
          : todo,
      ),
    }))
  },

  clearCompleted: () => {
    todoStore.setState((state) => ({
      todos: state.todos.filter((todo) => !todo.completed),
    }))
  },

  clearArchived: () => {
    todoStore.setState((state) => ({
      todos: state.todos.filter((todo) => !todo.archived),
    }))
  },
}
