import Image from 'next/image';
import { useMemo } from 'react';
import { PostCard } from '../components/PostCard';
import { useAuthor } from '../hooks/fetch/useAuthor';

export default function Home() {
  const { data: queryAuthorResponse, isLoading } = useAuthor({
    uid: 'guilherme-leoni',
    page: 1,
  });

  const { posts, author, totalPages } = useMemo(
    () => (queryAuthorResponse ? queryAuthorResponse : { posts: [], author: null, totalPages: 0 }),
    [queryAuthorResponse],
  );

  return (
    <main className="max-w-6xl mx-auto">
      {author && (
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="rounded-full w-[160px] h-[160px] overflow-hidden">
            <Image
              className="w-full h-full"
              src={author.picture.url}
              width={160}
              height={160}
              alt={author.picture.alt ?? ''}
            />
          </div>
          <strong className="font-inter text-4xl font-bold">{author.name}</strong>
          <span className="text-lg text-stale-500 font-medium italic">{author.bio}</span>
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="w-[160px] aspect-square bg-gray-200 rounded-full"></div>
          <div className="w-[20%] h-6 bg-gray-200"></div>
          <div className="w-[40%] h-3 bg-gray-200"></div>
        </div>
      )}
      <main className="mx-auto grid grid-cols-1 gap-16 py-20">
        {posts?.map((post) => {
          return (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              thumbnail={post.thumbnail}
              date={post.date}
              excerpt={post.excerpt}
            />
          );
        })}
        {isLoading && (
          <>
            {Array(3)
              .fill('')
              .map((_, index) => {
                return (
                  <div className="flex gap-4 w-full" key={index}>
                    <div className="animate-pulse bg-gray-200 h-[270px] w-full  max-w-[360px]"></div>
                    <div className="w-full gap-4 flex flex-col">
                      <div className="animate-pulse w-[80%] h-[20%] bg-gray-200"></div>
                      <div className="animate-pulse w-[20%] h-[10%] bg-gray-200"></div>
                      <div className="animate-pulse w-[100%] h-[100%] bg-gray-200"></div>
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </main>
    </main>
  );
}
