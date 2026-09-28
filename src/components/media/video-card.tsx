type Props = {
  src: string;
  poster?: string | null;
  caption?: string;
};

export function VideoCard({ src, poster, caption }: Props) {
  return (
    <figure className="overflow-hidden rounded-[24px] bg-black">
      <video
        controls
        preload="metadata"
        poster={poster || undefined}
        className="aspect-video w-full"
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      {caption ? <figcaption className="px-4 py-3 text-sm text-cream/80">{caption}</figcaption> : null}
    </figure>
  );
}
