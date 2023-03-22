import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAuthor } from '../hooks/fetch/useAuthor';

export default function Home() {
  const { data: queryAuthorResponse } = useAuthor({
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
      <main className="mx-auto grid grid-cols-1 gap-16 py-20">
        {posts?.map((post) => {
          return (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <div key={post.id} className="flex items-stretch gap-4">
                <div className="w-full max-w-[360px] overflow-hidden">
                  <Image className="object-cover" src={post.thumbnail} width={360} height={260} alt="" />
                </div>
                <div className="flex flex-col gap-4">
                  <strong className="text-4xl font-bold text-gray-800 font-inter">{post.title}</strong>
                  <span className="italic text-gray-500">{post.date}</span>
                  <p className="text-lg">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </main>
    </main>
  );
}
