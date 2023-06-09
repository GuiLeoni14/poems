import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { AuthorCard } from '../components/AuthorCard';
import { getPrismicClient } from '../lib/prismicClient';

type Author = {
  uid: string;
  name: string;
  bio: string;
  picture: {
    url: string;
    alt?: string;
  };
};

interface HomeProps {
  authors: Author[];
}

export default function Home({ authors }: HomeProps) {
  return (
    <>
      <Head>
        <title>Poems - Poetas que talvez tenham aprendido a amar</title>
        <meta
          name="description"
          content="Nos versos destes seres muitos já se perderam, alguns ainda estão presos neles e nem mesmo eles sabem como sair de lá"
        />
      </Head>
      <main className="container mx-auto max-w-6xl py-20">
        <h2 className="text-stale-500 text-center text-4xl font-bold dark:text-gray-100">
          Poetas que talvez tenham aprendido a amar
        </h2>
        <p className="text-stale-500 mt-2 text-center text-xl font-medium italic dark:text-gray-100">
          {`"Nos versos destes seres muitos já se perderam, alguns ainda estão presos neles e nem mesmo eles sabem como sair
        de lá"`}
        </p>
        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2">
          {authors.map((author) => {
            return (
              <Link key={author.uid} href={`/author/${author.uid}`}>
                <AuthorCard bio={author.bio} name={author.name} picture={author.picture} />
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  const prismic = await getPrismicClient({
    previewData: ctx.previewData,
  });

  const response = await prismic.getAllByType('author');

  const authors = response.map((author) => {
    return {
      uid: author.uid,
      name: RichText.asText(author.data.name),
      bio: RichText.asText(author.data.bio),
      picture: {
        url: author.data.picture.url,
        alt: author.data.picture.url,
      },
    };
  });

  return {
    props: {
      authors,
    },
    revalidate: 10 * 60,
  };
};
