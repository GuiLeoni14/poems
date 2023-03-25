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
        <div className="w-full max-w-[360px] overflow-hidden">
          <Image className="object-cover" src={thumbnail} width={360} height={260} alt="" />
        </div>
        <div className="flex flex-col gap-4">
          <strong className="text-4xl font-bold text-gray-800 font-inter">{title}</strong>
          <span className="italic text-gray-500">{date}</span>
          <p className="text-lg">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
