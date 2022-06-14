export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error("An error occurred while fetching the data");
  });
