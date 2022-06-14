import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { prisma } from "../../../lib/prisma";
import { MAX_SEARCH_RESULTS } from "../../../lib/services/magicNumbers";

interface Request extends NextApiRequest {
  body: {
    query: string;
    searchId: string;
    maxMonth: string;
    maxDay: string;
    maxYear: string;
  };
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const newSearch = async (searchId: string, userId: string) => {
  const search = await prisma.search.create({
    data: {
      id: searchId,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

const createSearchResult = async (result: any, searchId: string) => {
  const searchResult = await prisma.searchResult.create({
    data: {
      position: result.position,
      displayedLink: result.displayed_link,
      link: result.link,
      title: result.title,
      snippet: result.snippet,
      search: {
        connect: {
          id: searchId,
        },
      },
    },
  });
  return searchResult;
};

const processSearch = async (
  serpapiResults: any[],
  searchId: string,
  maxYear: string,
  maxMonth: string,
  maxDay: string
) => {
  const start = Date.now();
  for (let i = 0; i < serpapiResults.length; i++) {
    if (Date.now() - start > 50000) {
      break;
    }
    const result = serpapiResults[i];
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
    createSearchResult(result, searchId);
  }
  const search = await prisma.search.update({
    where: {
      id: searchId,
    },
    data: {
      finished: true,
    },
  });
};

export default async function handle(req: Request, res: NextApiResponse) {
  const { query, searchId, maxMonth, maxDay, maxYear } = req.body;
  const session = await getSession({ req });
  if (session === null) {
    res.status(401).json({ message: "Not logged in" });
    return;
  }

  const fetchUrl = `https://serpapi.com/search.json?engine=google&q=${query}&api_key=b1345b2c7e4bc848fa01b269898eeae970907e8abecc064f93b912a3812d7960&tbs=cdr:1,cd_min:,cd_max:${maxMonth}/${maxDay}/${maxYear}&num=${MAX_SEARCH_RESULTS}`;

  const rawResult = await fetch(fetchUrl);

  if (!rawResult.ok) {
    console.log(rawResult);
    res.status(400);
    return;
  }
  const serpapiResults = (await rawResult.json())["organic_results"] as any[];

  newSearch(searchId, session.user.id);
  processSearch(serpapiResults, searchId, maxYear, maxMonth, maxDay);

  res.status(200).json({});
}
