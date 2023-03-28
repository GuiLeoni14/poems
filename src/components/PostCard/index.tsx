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
      <div key={id} className="flex items-stretch gap-4 flex-col md:flex-row">
        <div className="w-full overflow-hidden h-[300px] md:h-[250px] md:max-w-[360px]">
          <Image className="object-cover w-full h-full" src={thumbnail} width={360} height={260} alt="" />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <strong className="font-bold text-gray-800 font-inter dark:text-gray-100 text-3xl md:text-4xl">
            {title}
          </strong>
          <span className="italic text-gray-500 dark:text-gray-200">{date}</span>
          <p className="text-base dark:text-gray-100 leading-relaxed md:text-lg md:leading-relaxed">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
