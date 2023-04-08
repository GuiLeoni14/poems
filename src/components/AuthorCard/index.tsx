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
    <div className="flex flex-col justify-center items-center gap-4 container mx-auto">
      <div className="rounded-full w-[160px] h-[160px] overflow-hidden">
        <Image className="w-full h-full" src={picture.url} width={160} height={160} alt={picture.alt ?? ''} />
      </div>
      <strong className="font-inter font-bold dark:text-gray-100 text-center text-3xl md:text-4xl">{name}</strong>
      <span className="text-lg text-stale-500 font-medium italic dark:text-gray-100 text-center">{bio}</span>
    </div>
  );
}
