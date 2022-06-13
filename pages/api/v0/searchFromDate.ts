import type { NextApiRequest, NextApiResponse } from "next";

interface Request extends NextApiRequest {
  body: {
    query: string;
    maxMonth: string;
    maxDay: string;
    maxYear: string;
  };
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handle(req: Request, res: NextApiResponse) {
  const start = Date.now();

  const { query, maxMonth, maxDay, maxYear } = req.body;

  const fetchUrl = `https://serpapi.com/search.json?engine=google&q=${query}&api_key=b1345b2c7e4bc848fa01b269898eeae970907e8abecc064f93b912a3812d7960&tbs=cdr:1,cd_min:,cd_max:${maxMonth}/${maxDay}/${maxYear}&num=25`;

  const rawResult = await fetch(fetchUrl);

  if (!rawResult.ok) {
    console.log(rawResult);
    res.status(400);
    return;
  }

  const serpapiResults = (await rawResult.json())["organic_results"] as any[];

  const archivedResults = [] as any[];
  for (let i = 0; i < serpapiResults.length; i++) {
    if (Date.now() - start > 9 * 1000) {
      break;
    }
    const result = serpapiResults[i];
    //console.log(Date.now());
    const cdxFetchURL = `http://web.archive.org/cdx/search/cdx?url=${result["link"]}&to=${maxYear}${maxMonth}${maxDay}&output=json&limit=-2&fl=timestamp&fastLatest=true`;
    console.log(cdxFetchURL);
    let cdxResponse = undefined;
    try {
      cdxResponse = await fetch(cdxFetchURL);
    } catch (e) {
      // TODO: retry with exponential backoff maybe?
      console.log(cdxFetchURL);
      console.log(e);
      continue;
    }
    if (!cdxResponse.ok) {
      console.log(cdxResponse);
      continue;
    }
    const cdxArr = await cdxResponse.json();
    //console.log(cdxArr);
    if (cdxArr[2] && cdxArr[2][0]) {
      result[
        "link"
      ] = `https://web.archive.org/web/${cdxArr[2][0]}/${result["link"]}`;
    } else if (cdxArr[1] && cdxArr[1][0]) {
      result[
        "link"
      ] = `https://web.archive.org/web/${cdxArr[1][0]}/${result["link"]}`;
    } else {
      continue;
    }

    archivedResults.push(result);
  }

  const archivedResultsFiltered = archivedResults.filter(Boolean);

  res.status(200).json(archivedResultsFiltered);
}
