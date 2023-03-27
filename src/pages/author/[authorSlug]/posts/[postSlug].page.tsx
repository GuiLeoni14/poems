import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../../../lib/prismicClient';

interface PagePostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    date: string;
    cover: string;
  };
}
export default function PagePost({ post }: PagePostProps) {
  const router = useRouter();
  const tilePage = `${post.title} | Post`;
  return (
    <main className="pb-10">
      <div
        className="h-[400px] w-full bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('${post.cover}')`,
        }}
      ></div>
      <div className="container max-w-6xl mx-auto -mt-40 bg-white p-4 shadow-2xl dark:bg-gray-700">
        <Link href={`/author/${router.query.authorSlug}`}>
          <span className="font-semibold dark:text-gray-200">← Back to articles</span>
        </Link>
        <div className="flex flex-col gap-4 flex-1 mt-16">
          <strong className="text-4xl font-bold text-gray-800 font-inter dark:text-gray-100">{post.title}</strong>
          <span className="italic text-gray-500 dark:text-gray-200">{post.date}</span>
          <p className="text-lg font-medium dark:text-gray-200">{post.excerpt}</p>
        </div>
        <div className="mt-16 post_content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const prismic = getPrismicClient({
    previewData: ctx.previewData,
  });
  const { authorSlug, postSlug } = ctx.params as { authorSlug: string; postSlug: string };

  if (!authorSlug || !postSlug) {
    return {
      notFound: true,
    };
  }

  try {
    const author = await prismic.getByUID('author', authorSlug);
    if (!author) {
      return { notFound: true };
    }

    const authorPostByPostUid = author.data.posts.find((post: any) => post.post.uid === postSlug).post;
    const postResponse = await prismic.getByUID('post', authorPostByPostUid.uid);

    if (!postResponse) {
      return { notFound: true };
    }

    const post = {
      id: postResponse.uid,
      title: RichText.asText(postResponse.data.title),
      excerpt: RichText.asText(postResponse.data.excerpt),
      content: RichText.asHtml(postResponse.data.content),
      date: new Date(postResponse.data.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      thumbnail: postResponse.data.thumbnail.url,
      cover: postResponse.data.cover.url,
    };

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: { post },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
