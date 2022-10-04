import type { NextApiRequest, NextApiResponse } from "next";
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
export default async function handle(req: Request, res: NextApiResponse) {
  const { query, searchId, maxMonth, maxDay, maxYear } = req.body;
  const url = "https://en.wikipedia.org/w/api.php";
  const params = {
    origin: "*",
    action: "query",
    list: "search",
    srsearch: query,
    format: "json",
    srlimit: 3,
  };

  //create the url
  const fetchUrl =
    url +
    "?" +
    Object.keys(params)
      .map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      })
      .join("&");

  console.log(fetchUrl);
  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: new Headers({
      "Api-User-Agent": "Pastcasting/1.0",
    }),
  });
  const json = await response.json();
  const pages = json.query.search;
  let results = [];
  for (let i = 0; i < pages.length; i++) {
    const { title, snippet } = pages[i];
    const params2 = {
      action: "query",
      prop: "revisions",
      titles: title,
      rvlimit: 1,
      rvprop: "ids",
      format: "json",
      rvdir: "older",
      rvstart: `${maxYear}-${maxMonth}-${maxDay}T00:00:00Z`,
    };
    const fetchUrl2 =
      url +
      "?" +
      Object.keys(params2)
        .map(function (k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(params2[k]);
        })
        .join("&");
    const response2 = await fetch(fetchUrl2);
    console.log(fetchUrl2);
    console.log(response2);
    const json2 = await response2.json();
    const revisionId =
      json2.query.pages[Object.keys(json2.query.pages)[0]].revisions[0].revid;
    const link = `https://en.wikipedia.org/?oldid=${revisionId}`;
    console.log(link);
    results.push({
      title,
      snippet: snippet.replace(/<[^>]*>?/gm, ""),
      link,
      displayedLink: link,
      position: i + 1,
    });
  }
  console.log(results);
  res.json(results);
}
