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
      <div key={id} className="flex flex-col items-stretch gap-4 md:flex-row">
        <div className="h-[300px] w-full overflow-hidden md:h-[250px] md:max-w-[360px]">
          <Image className="h-full w-full object-cover" src={thumbnail} width={360} height={260} alt="" />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <strong className="font-inter text-3xl font-bold text-gray-800 dark:text-gray-100 md:text-4xl">
            {title}
          </strong>
          <span className="italic text-gray-500 dark:text-gray-200">{date}</span>
          <p className="text-base leading-relaxed dark:text-gray-100 md:text-lg md:leading-relaxed">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
