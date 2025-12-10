import { createFileRoute } from '@tanstack/react-router'
import { TodoList } from '../../components/TodoList'

export const Route = createFileRoute('/demo/todos')({
  component: TodosPage,
})

function TodosPage() {
  return <TodoList />
}
