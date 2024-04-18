import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

const getResults = async (url: string, country: string) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const customUA =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';

    // Set custom user agent
    await page.setUserAgent(customUA);

    // Navigate the page to a URL
    await page.goto(url + country);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const content = await page.content();
    const trimmedContent = content.replace(/\s+|\n|\r/g, '');
    const data = trimmedContent.match(
      /<scripttype="application\/ld\+json">(.+)<\/script><linkrel="stylesheet"media="/
    );
    const parsedData = JSON.parse(data?.[1] || '{}');
    const ratings = parsedData?.aggregateRating?.ratingValue;
    // fs.writeFileSync(`./bodyHTML-${country}.html`, trimmedContent);
    await browser.close();
    resolve({ country, notation: ratings });
  });
};

export async function POST(req: Request, res: NextApiResponse) {
  const { countries, url }: { countries: string, url: string } = await req.json();
  console.log(url);
  const countriesArray = countries.split(/,\s*/);
  console.log(countriesArray);
  const results = await Promise.all(countriesArray.map(async (country: string) =>  await getResults(url, country)));
  console.log({ results });
  return Response.json({ data: results });
}
