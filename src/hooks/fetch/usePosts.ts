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

export const getPosts = async (params?: any) => {
  const prismicClient = getPrismicClient();
  const response = await prismicClient.query(prismic.Predicates.at('document.type', 'post'), {
    orderings: 'my.post.date desc',
    page: 1,
    pageSize: 5,
    ...params,
  });
  const posts = response.results.map((post: any) => {
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
  return posts as Post[];
};

interface UsePostsProps {
  identifier?: string | string[];
  params?: any;
  options?: any;
}
export function usePosts({ params, options, identifier }: UsePostsProps) {
  return useQuery<Post[]>(['posts', identifier], () => getPosts(params), {
    staleTime: 1000 * 1, // 1 second
    ...options,
  });
}
