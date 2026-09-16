import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/pnms')({
    beforeLoad: async ({ location }) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (!token) {
            throw redirect({
                to: '/login',
                search: { redirect: location.href },
            })
        }
        const res = await fetch(`${import.meta.env.VITE_LOCAL_BACKEND}/auth/verify-token`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })

        if (!res.ok) {
            if (typeof window !== 'undefined') localStorage.removeItem('auth-token')
            throw redirect({ to: '/login', search: { redirect: location.href } })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet />
}
