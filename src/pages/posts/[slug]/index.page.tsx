import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths } from 'next';
import Image from 'next/image';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../../lib/prismicClient';

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
  const tilePage = `${post.title} | Post`;
  return (
    <main>
      <div
        className="h-[400px] w-full bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('${post.cover}')`,
        }}
      ></div>
      <div className="container max-w-6xl mx-auto -mt-40 bg-white p-4 rounded-md">
        <div className="flex gap-4">
          <div className="w-full max-w-[600px] overflow-hidden mx-auto">
            <Image className="object-cover w-full h-full" src={post.thumbnail} width={360} height={260} alt="" />
          </div>
          <div className="flex flex-col gap-4">
            <strong className="text-4xl font-bold text-gray-800 font-inter">{post.title}</strong>
            <span className="italic text-gray-500">{post.date}</span>
            <p className="text-lg">{post.excerpt}</p>
          </div>
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
  const { slug } = ctx.params!;
  const response = await prismic.getByUID('post', slug as string);
  const post = {
    id: response.uid,
    title: RichText.asText(response.data.title),
    excerpt: RichText.asText(response.data.excerpt),
    content: RichText.asHtml(response.data.content),
    date: new Date(response.data.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    thumbnail: response.data.thumbnail.url,
    cover: response.data.cover.url,
  };
  const teste = await prismic.getByUID('author', 'guilherme-leoni');
  console.log(teste.data.posts);
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post },
  };
};
