import { useTranslations } from "next-intl";

export function getImageUrl(image: string) {
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`;
}

export function translate(key: string) {
  const t = useTranslations();
  return t(key);
}
