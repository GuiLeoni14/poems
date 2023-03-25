import * as prismic from '@prismicio/client';
import { useQuery } from '@tanstack/react-query';
import { RichText } from 'prismic-dom';
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
interface GetAuthorResponse {
  author: Author;
  posts: Post[];
  totalPages: number;
}

export const getAuthor = async (authorUID: string, page = 1, pageSize = 2): Promise<GetAuthorResponse> => {
  const prismicClient = getPrismicClient();
  const author = await prismicClient.getByUID('author', authorUID);
  const authorPosts = author.data.posts.map((post: any) => post.post.id);

  const start = page;
  const end = start + pageSize;

  const posts = await prismicClient
    .query([prismic.Predicates.in('document.id', authorPosts.slice(start, end))])
    .then((response) => {
      return response.results.map((post: any) => {
        return {
          id: post.uid,
          title: RichText.asText(post.data.title),
          excerpt: RichText.asText(post.data.excerpt),
          content: RichText.asHtml(post.data.content),
          date: new Date(post.data.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          thumbnail: post.data.thumbnail.url,
          cover: post.data.cover.url,
        };
      });
    });
  return {
    author: {
      uid: author.uid,
      name: RichText.asText(author.data.name),
      bio: RichText.asText(author.data.bio),
      picture: author.data.picture,
    },
    posts,
    totalPages: Math.ceil(authorPosts.length / pageSize),
  };
};

export const useAuthor = ({ uid, page, pageSize }: { uid: string; page: number; pageSize?: number }) => {
  return useQuery(['author', uid, page], () => getAuthor(uid, page, pageSize), {
    keepPreviousData: true, // mantém os dados da página anterior enquanto carrega a próxima página
  });
};
