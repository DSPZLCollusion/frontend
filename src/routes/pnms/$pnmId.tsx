import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/pnms/$pnmId')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet />
}
