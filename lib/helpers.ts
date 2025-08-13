export function getImageUrl(image: string) {
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`;
}
