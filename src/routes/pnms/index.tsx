import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPnms } from '#/util/http';
import SearchBar from '#/components/SearchBar';

export const Route = createFileRoute('/pnms/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['pnms'],
    queryFn: ({ signal }) => fetchPnms({ signal })
  });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p>Failed to load PNMs. Please try again.</p>;

  return <SearchBar allPnms={data ?? []} />;
}
