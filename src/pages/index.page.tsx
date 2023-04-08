import { GetStaticProps, GetStaticPropsContext } from 'next';
import Image from 'next/image';
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
  console.log(authors);
  return (
    <main className="container max-w-6xl mx-auto py-20">
      <div className="flex items-center">
        <div className="max-w-[600px]">
          <h1 className="text-4xl text-stale-500 font-bold dark:text-gray-100">
            Poemas de poetas que talvez aprenderam a amar
          </h1>
          <p className="text-xl text-stale-500 font-medium italic dark:text-gray-100 mt-2">
            Os poetas não só sabem amar como são capazes de expressar esse sentimento de forma tão sublime que
            transformam o amor em poesia, e a poesia em amor eterno.
          </p>
        </div>
        <div>
          <Image src={`/img/b_home.png`} width={600} height={400} alt="" />
        </div>
      </div>
      <h2 className="text-3xl text-stale-500 font-bold text-center dark:text-gray-100 mt-20">Autores</h2>
      <div className="grid grid-cols-2 gap-14 mt-10">
        {authors.map((author) => {
          return (
            <Link key={author.uid} href={`/author/${author.uid}`}>
              <AuthorCard bio={author.bio} name={author.name} picture={author.picture} />
            </Link>
          );
        })}
      </div>
    </main>
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
  };
};
