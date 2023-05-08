import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';
import { PreviewData } from 'next';

type TConfigTypePrismic = {
  req?: prismic.HttpRequestLike | any;
  previewData: PreviewData;
};
// eles comendam criar em formato de função para exportar o client do prismic pois assim terá um nova instancia para cada utilização(sempre usar um client novo)
export function getPrismicClient(config?: TConfigTypePrismic) {
  const primisc = prismic.createClient('https://poesia.cdn.prismic.io/api/v2' as string, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  prismicNext.enableAutoPreviews({
    client: primisc,
    previewData: config?.previewData,
    req: config?.req,
  });

  return primisc;
}
