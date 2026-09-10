import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';

import Form from '#/components/form/Form'
import { createNewPnm, queryClient } from '#/util/http';
import type { CreatePnmBody } from '#/util/pnmModel';

export const Route = createFileRoute('/pnms/create')({ component: PnmsCreate })

function PnmsCreate() {
    const navigate = useNavigate();

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: createNewPnm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pnms"] });
            navigate({ to: "/pnms" });
        },
    });

    function handleSubmit(formData: CreatePnmBody) {
        mutate(formData);
    }

    function handleCancel() {
        navigate({ to: "/pnms" });
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold">Create PNMS</h1>
            <Form onSubmit={handleSubmit} isPending={isPending} error={isError ? error : undefined}>
                <button type="button" onClick={handleCancel}>
                    Cancel
                </button>
            </Form>
        </div>
    )
}