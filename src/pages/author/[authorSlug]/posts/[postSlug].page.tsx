import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
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
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:image" content={post.thumbnail} />
        <meta property="og:image:secure_url" content={post.thumbnail} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="300" />
        <meta property="og:image:alt" content={post.title} />
      </Head>
      <main className="pb-10">
        <div
          className="h-[400px] w-full bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url('${post.cover}')`,
          }}
        ></div>
        <div className="container max-w-6xl mx-auto -mt-10 bg-white p-4 shadow-2xl dark:bg-gray-700">
          <Link href={`/author/${router.query.authorSlug}`}>
            <span className="font-semibold dark:text-gray-200">← Voltar aos artigos</span>
          </Link>
          <div className="flex flex-col gap-4 flex-1 mt-16">
            <strong className="font-bold text-gray-800 font-inter dark:text-gray-100 text-3xl md:text-4xl">
              {post.title}
            </strong>
            <span className="italic text-gray-500 dark:text-gray-200">{post.date}</span>
            <p className="font-medium dark:text-gray-200 leading-relaxed md:text-lg md:leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          <div className="post_content mt-16" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
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

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
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
      revalidate: 60 * 2, // 2 minutes
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
