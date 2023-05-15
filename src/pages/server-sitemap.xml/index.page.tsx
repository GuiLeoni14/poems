import { GetServerSidePropsContext } from 'next';
import { getServerSideSitemap, ISitemapField } from 'next-sitemap';
import { getPrismicClient } from '../../lib/prismicClient';
//eslint-disable-next-line
export default async function SiteMap() {}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const prismic = getPrismicClient({
    previewData: ctx.previewData,
  });

  const response = await prismic.getAllByType('author');

  const fieldsAuthors: ISitemapField[] = response.map((author) => ({
    loc: `${process.env.NEXT_PUBLIC_SITE_URL}/author/${author.uid}`,
    lastmod: new Date().toISOString(),
  }));

  const fieldsPostsByAuthor: ISitemapField[] = [];

  response.map((author) => {
    author.data.posts.map((postResponse: any) => {
      fieldsPostsByAuthor.push({
        loc: `${process.env.NEXT_PUBLIC_SITE_URL}/author/${author.uid}/posts/${postResponse.post.slug}`,
        lastmod: new Date().toISOString(),
      });
    });
  });

  return getServerSideSitemap(ctx, [...fieldsAuthors, ...fieldsPostsByAuthor]);
};
