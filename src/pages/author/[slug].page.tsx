import classNames from 'classnames';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PostCard } from '../../components/PostCard';
import { useAuthor } from '../../hooks/fetch/useAuthor';
import { getPrismicClient } from '../../lib/prismicClient';

type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  date: string;
  cover: string;
};

type Author = {
  uid: string | null;
  name: string;
  bio: string;
  picture: {
    dimensions: string;
    alt: string | null;
    copyright: string | null;
    url: string;
  };
};
interface PageAuthorProps {
  author: Author;
}

export default function PageAuthor({ author }: PageAuthorProps) {
  const isDisabled = useRef(false);
  const router = useRouter();
  const loaderNewPostsObserverRef = useRef<null | HTMLDivElement>(null);
  const [actualPage, setActualPage] = useState(0);
  const [postsGrid, setPostsGrid] = useState<Post[]>([]);

  const { data: queryAuthorResponse, isLoading } = useAuthor({
    uid: author.uid as string,
    page: actualPage,
    pageSize: 2,
  });

  const { posts, totalPages } = useMemo(
    () => (queryAuthorResponse ? queryAuthorResponse : { posts: [], author: null, totalPages: 0 }),
    [queryAuthorResponse],
  );

  const isLoadingPosts = isLoading;

  const isNotRenderNewPosts = actualPage >= totalPages;

  const handleMountNewPosts = useCallback(async (entries: IntersectionObserverEntryInit[]) => {
    const target = entries[0];
    if (target.isIntersecting && isDisabled.current === false) {
      isDisabled.current = true;
      setActualPage((state) => state + 2);
    }
  }, []);

  useEffect(() => {
    if (isNotRenderNewPosts) return;
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleMountNewPosts, option);
    if (loaderNewPostsObserverRef.current) observer.observe(loaderNewPostsObserverRef.current);
  }, [handleMountNewPosts, isNotRenderNewPosts]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setPostsGrid((state) => {
        return [...state, ...posts];
      });
      isDisabled.current = false;
    }
  }, [posts]);

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
      {!author && (
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="w-[160px] aspect-square bg-gray-200 rounded-full"></div>
          <div className="w-[20%] h-6 bg-gray-200"></div>
          <div className="w-[40%] h-3 bg-gray-200"></div>
        </div>
      )}
      <main className="mx-auto grid grid-cols-1 gap-16 py-20">
        {postsGrid.map((post) => {
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
      <div
        className={classNames('w-full block h-2', {
          'h-0 w-0 hidden': isNotRenderNewPosts,
        })}
        ref={loaderNewPostsObserverRef}
      />
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageAuthorProps> = async (ctx) => {
  const authorUID = ctx.params?.slug as string;

  const prismic = await getPrismicClient({
    previewData: ctx.previewData,
  });

  const response = await prismic.getByUID('author', authorUID);

  if (!response.data) {
    return {
      notFound: true,
    };
  }

  const author: Author = {
    uid: response.uid,
    name: RichText.asText(response.data.name),
    bio: RichText.asText(response.data.bio),
    picture: response.data.picture,
  };

  return {
    props: {
      author,
    },
  };
};
