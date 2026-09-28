import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to a funny project I am somehow getting paid to do cause side project</h1>
      <p className="mt-4 text-lg">
        I am not paycheck stealing but like idk if this even works well lol
      </p>
    </div>
  )
}
