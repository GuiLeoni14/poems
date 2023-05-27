import classNames from 'classnames';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PostCard } from '../../../components/PostCard';
import { useAuthor } from '../../../hooks/fetch/useAuthor';
import { getPrismicClient } from '../../../lib/prismicClient';

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

  useEffect(() => {
    // por conta do reactStrictMode
    return () => setPostsGrid([]);
  }, []);

  return (
    <>
      <Head>
        <title>{author.name}</title>
        <meta name="description" content={author.bio} />
        <meta property="og:image" content={author.picture.url} />
        <meta property="og:image:secure_url" content={author.picture.url} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="300" />
        <meta property="og:image:alt" content={author.name} />
      </Head>
      <main className="mx-auto max-w-6xl py-20">
        {author && (
          <div className="container mx-auto flex flex-col items-center justify-center gap-4">
            <div className="h-[160px] w-[160px] overflow-hidden rounded-full">
              <Image
                className="h-full w-full"
                src={author.picture.url}
                width={160}
                height={160}
                alt={author.picture.alt ?? ''}
              />
            </div>
            <strong className="text-center font-inter text-3xl font-bold dark:text-gray-100 md:text-4xl">
              {author.name}
            </strong>
            <span className="text-stale-500 text-center text-lg font-medium italic dark:text-gray-100">
              {author.bio}
            </span>
          </div>
        )}
        {!author && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="aspect-square w-[160px] rounded-full bg-gray-200"></div>
            <div className="h-6 w-[20%] bg-gray-200"></div>
            <div className="h-3 w-[40%] bg-gray-200"></div>
          </div>
        )}
        <main className="container mx-auto mt-16 grid grid-cols-1 gap-16 md:mt-20">
          {postsGrid.map((post) => {
            return (
              <PostCard
                key={post.id}
                authorId={author.uid as string}
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
                    <div className="flex w-full flex-col gap-4 md:flex-row" key={index}>
                      <div className="h-[300px] w-full max-w-[360px]  animate-pulse bg-gray-200 md:h-[270px]"></div>
                      <div className="flex h-full w-full flex-col gap-4">
                        <div className="h-[20%] w-[80%] animate-pulse bg-gray-200"></div>
                        <div className="h-[10%] w-[20%] animate-pulse bg-gray-200"></div>
                        <div className="h-[100%] w-[100%] animate-pulse bg-gray-200"></div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </main>
        <div
          className={classNames('block h-2 w-full', {
            'hidden h-0 w-0': isNotRenderNewPosts,
          })}
          ref={loaderNewPostsObserverRef}
        />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageAuthorProps> = async (ctx) => {
  const authorUID = ctx.params?.authorSlug as string;

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
    revalidate: 60 * 2, // 2 minutes
  };
};
