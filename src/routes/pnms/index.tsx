import { createFileRoute } from '@tanstack/react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPnms } from '#/util/http';
import SearchBar from '#/components/searchbar/SearchBar';

export const Route = createFileRoute('/pnms/')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['pnms'],
    queryFn: ({ signal, pageParam }) =>
      fetchPnms({ signal, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p>Failed to load PNMs. Please try again.</p>;

  const allPnms = data.pages.flatMap((page) => page.data);

  return (
    <>
      <SearchBar allPnms={allPnms} />

      {hasNextPage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', padding: '2rem' }}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{
              border: 'none',
              background: isFetchingNextPage ? '#5e222b' : '#7a2e3a',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.88rem',
              fontWeight: 500,
              padding: '0.55rem 1.4rem',
              borderRadius: '5px',
              cursor: isFetchingNextPage ? 'not-allowed' : 'pointer',
              opacity: isFetchingNextPage ? 0.7 : 1,
            }}
          >
            {isFetchingNextPage ? 'Loading more…' : 'Load more'}
          </button>
        </div>
      )}
    </>
  );
}