import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  id: string;
  title: string;
  thumbnail: string;
  excerpt: string;
  authorId: string;
  date: string;
}

export function PostCard({ id, title, excerpt, thumbnail, date, authorId }: PostCardProps) {
  return (
    <Link href={`/author/${authorId}/posts/${id}`} key={id}>
      <div key={id} className="flex items-stretch gap-4">
        <div className="w-full max-w-[360px] overflow-hidden h-[250px]">
          <Image className="object-cover w-full h-full" src={thumbnail} width={360} height={260} alt="" />
        </div>
        <div className="flex flex-col gap-4">
          <strong className="text-4xl font-bold text-gray-800 font-inter dark:text-gray-100">{title}</strong>
          <span className="italic text-gray-500 dark:text-gray-200">{date}</span>
          <p className="text-lg dark:text-gray-100">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
