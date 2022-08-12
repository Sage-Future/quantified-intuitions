import { NextSeo } from "next-seo";

export const Meta = () => {
  return (
    <NextSeo
      title="Pastcasting"
      description="Pastcasting is a tool for practicing forecasting."
      canonical="https://www.pastcasting.com/"
      openGraph={{
        type: "website",
        locale: "en_US",
        url: "https://www.pastcasting.com/",
        title: "Pastcasting",
        description: "Pastcasting is a tool for practicing forecasting.",
        site_name: "Pastcasting",
        images: [
          {
            url: "https://www.pastcasting.com/og.png",
            width: 1024,
            height: 1024,
          },
        ],
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
