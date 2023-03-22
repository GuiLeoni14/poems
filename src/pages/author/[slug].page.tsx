import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAuthor } from '../../hooks/fetch/useAuthor';

export default function Home() {
  const { data: queryAuthorResponse } = useAuthor({
    uid: 'guilherme-leoni',
    page: 1,
  });

  const { posts, author, totalPages } = useMemo(
    () => (queryAuthorResponse ? queryAuthorResponse : { posts: [], author: {}, totalPages: 0 }),
    [queryAuthorResponse],
  );

  return (
    <div>
      <div>
        <div></div>
      </div>
      <main className="container mx-auto grid grid-cols-1 gap-16 py-20">
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
    </div>
  );
}
