import Form from '#/components/form/Form';
import { fetchPnm, queryClient, updatePnm } from '#/util/http';
import type { CreatePnmBody } from '#/util/pnmModel';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/pnms/$pnmId/edit')({
  component: RouteComponent,
})


function RouteComponent() {
  const navigate = useNavigate();
  const { pnmId } = Route.useParams();

  const { data, isLoading, isError: isLoadError, error: loadError } = useQuery({
    queryKey: ['pnm', pnmId],
    queryFn: ({ signal }) => fetchPnm({ signal, id: pnmId })
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updatePnm,
    onMutate: async (data) => {
      const newPnm = data.pnmDetails;
      await queryClient.cancelQueries({ queryKey: ['pnms', pnmId] });

      const previousPnm = queryClient.getQueryData(['pnms', pnmId]);
      queryClient.setQueryData(['pnms', pnmId], newPnm);

      return { previousPnm }
    },
    onError: (_error, _data, context) => {
      queryClient.setQueryData(['pnms', pnmId], context?.previousPnm);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pnms', pnmId] });
    }
  });

  function handleSubmit(formData: CreatePnmBody) {
    mutate({ id: pnmId, pnmDetails: formData });
    navigate({ to: "/pnms/$pnmId", params: { pnmId } });
  }

  function handleCancel() {
    navigate({ to: "/pnms/$pnmId", params: { pnmId } });
  }

  let content;

  if (isLoading) {
    content = <p>Loading&hellip;</p>;
  } else if (isLoadError) {
    content = <p role="alert">{loadError instanceof Error ? loadError.message : "Failed to load this PNM."}</p>;
  } else if (data) {
    content = (
      <Form inputData={data} onSubmit={handleSubmit} isPending={isPending} error={isError ? error : undefined}>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </Form>
    )
  }

  return (
    <div>
      {content}
    </div>
  )
}