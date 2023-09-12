'use client';
import { useSocket } from '@/providers/socket-provider';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import qs from 'query-string';

interface UseChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: UseChatQueryProps) => {
  const { isConnected } = useSocket();

  const param = useParams();

  const fetchMessage = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: `${process.env.NEXT_PUBLIC_SOMETHING_API_URL}${apiUrl}`,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      {
        skipNull: true,
      }
    );

    const res = await fetch(url);

    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessage,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};

export default useChatQuery;
