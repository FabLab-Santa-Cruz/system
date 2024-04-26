import { env } from "~/env";
/**
 * Get an image from storage with just the key
 * @param url string
 */
export function WithUrl(url: string) {
  return `${env.NEXT_PUBLIC_STORAGE_PATH}${url}`
}