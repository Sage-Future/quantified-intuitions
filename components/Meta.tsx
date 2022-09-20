import { NextSeo } from "next-seo";

export const Meta = () => {
  return (
    <NextSeo
      title="Quantified Intuitions"
      description="Quantified Intuitions helps users practice the process of assigning credences to outcomes with a quick feedback loop."
      canonical="https://www.quantifiedintuitions.com/"
      openGraph={{
        type: "website",
        locale: "en_US",
        url: "https://www.quantifiedintuitions.com/",
        title: "Quantified Intuitions",
        description:
          "Quantified Intuitions helps users practice the process of assigning credences to outcomes with a quick feedback loop.",
        site_name: "Quantified Intuitions",
        images: [
          {
            url: "https://www.quantifiedintuitions.com/og.png",
            width: 1024,
            height: 1024,
          },
        ],
      }}
      additionalLinkTags={[
        {
          rel: "icon",
          href: "/scale.svg",
        },
      ]}
    />
  );
};
