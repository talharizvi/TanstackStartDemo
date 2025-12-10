import { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { todoStore, todoActions, type Todo } from '../lib/todo-store'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { cn } from '../lib/utils'

export function TodoList() {
  const todos = useStore(todoStore, (state) => state.todos)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed' | 'archived'
  >('all')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim()) {
      todoActions.createTodo(
        newTitle.trim(),
        newDescription.trim() || undefined,
      )
      setNewTitle('')
      setNewDescription('')
    }
  }

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
  }

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      todoActions.updateTodo(id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      })
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed && !todo.archived
    if (filter === 'completed') return todo.completed && !todo.archived
    if (filter === 'archived') return todo.archived
    return !todo.archived // 'all' shows non-archived todos
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <p className="text-muted-foreground">
          Manage your tasks with create, update, complete, delete, and archive
          features
        </p>
      </div>

      {/* Create Todo Form */}
      <form
        onSubmit={handleCreate}
        className="space-y-3 p-4 border rounded-lg bg-card"
      >
        <h2 className="text-xl font-semibold">Create New Todo</h2>
        <Input
          type="text"
          placeholder="Todo title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full"
        />
        <Textarea
          placeholder="Description (optional)..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full min-h-[80px]"
        />
        <Button type="submit" disabled={!newTitle.trim()}>
          Add Todo
        </Button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {(['all', 'active', 'completed', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 font-medium capitalize transition-colors',
              filter === f
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
            {f === 'all' && ` (${todos.filter((t) => !t.archived).length})`}
            {f === 'active' &&
              ` (${todos.filter((t) => !t.completed && !t.archived).length})`}
            {f === 'completed' &&
              ` (${todos.filter((t) => t.completed && !t.archived).length})`}
            {f === 'archived' && ` (${todos.filter((t) => t.archived).length})`}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No todos found. {filter !== 'all' && 'Try a different filter or '}
            Create your first todo!
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                'p-4 border rounded-lg bg-card transition-all',
                todo.completed && 'opacity-60',
                todo.archived && 'bg-muted',
              )}
            >
              {editingId === todo.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full"
                  />
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(todo.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => todoActions.toggleComplete(todo.id)}
                      className="mt-1 h-5 w-5 rounded cursor-pointer"
                      disabled={todo.archived}
                    />
                    <div className="flex-1">
                      <h3
                        className={cn(
                          'text-lg font-medium',
                          todo.completed &&
                            'line-through text-muted-foreground',
                        )}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p
                          className={cn(
                            'text-sm mt-1',
                            todo.completed
                              ? 'text-muted-foreground'
                              : 'text-foreground/80',
                          )}
                        >
                          {todo.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          Created: {new Date(todo.createdAt).toLocaleString()}
                        </span>
                        {todo.updatedAt !== todo.createdAt && (
                          <span>
                            Updated: {new Date(todo.updatedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {!todo.archived && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(todo)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => todoActions.toggleComplete(todo.id)}
                        >
                          {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => todoActions.toggleArchive(todo.id)}
                    >
                      {todo.archived ? 'Unarchive' : 'Archive'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (
                          confirm('Are you sure you want to delete this todo?')
                        ) {
                          todoActions.deleteTodo(todo.id)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bulk Actions */}
      {todos.length > 0 && (
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Clear all completed todos?')) {
                todoActions.clearCompleted()
              }
            }}
            disabled={!todos.some((t) => t.completed)}
          >
            Clear Completed
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Clear all archived todos?')) {
                todoActions.clearArchived()
              }
            }}
            disabled={!todos.some((t) => t.archived)}
          >
            Clear Archived
          </Button>
        </div>
      )}
    </div>
  )
}
