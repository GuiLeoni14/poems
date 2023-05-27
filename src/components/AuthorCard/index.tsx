import Image from 'next/image';

interface AuthorCardProps {
  name: string;
  bio: string;
  picture: {
    url: string;
    alt?: string;
  };
}
export function AuthorCard({ bio, name, picture }: AuthorCardProps) {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4">
      <div className="h-[160px] w-[160px] overflow-hidden rounded-full">
        <Image className="h-full w-full" src={picture.url} width={160} height={160} alt={picture.alt ?? ''} />
      </div>
      <strong className="text-center font-inter text-3xl font-bold dark:text-gray-100 md:text-4xl">{name}</strong>
      <span className="text-stale-500 text-center text-lg font-medium italic dark:text-gray-100">{bio}</span>
    </div>
  );
}
