import { NextSeo } from "next-seo";

export const Meta = () => {
  return (
    <NextSeo
      title="Pastcast"
      description="Pastcast is a tool for practicing forecasting."
      canonical="https://pastcast-sage.vercel.app/"
      openGraph={{
        type: "website",
        locale: "en_US",
        url: "https://pastcast-sage.vercel.app/",
        title: "Pastcast",
        description: "Pastcast is a tool for practicing forecasting.",
        site_name: "Pastcast",
      }}
      additionalLinkTags={[
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ]}
    />
  );
};
