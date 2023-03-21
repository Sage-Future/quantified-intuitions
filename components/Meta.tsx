import { DefaultSeo, NextSeo } from "next-seo";

export const Meta = () => {
  return (
    <DefaultSeo
      titleTemplate="%s - Quantified Intuitions"
      defaultTitle="Quantified Intuitions"
      description="Quantified Intuitions helps you practice assigning credences to outcomes with a quick feedback loop."
      canonical="https://www.quantifiedintuitions.org/"
      openGraph={{
        type: "website",
        locale: "en_US",
        url: "https://www.quantifiedintuitions.org/",
        title: "Quantified Intuitions",
        description:
          "Quantified Intuitions helps you practice assigning credences to outcomes with a quick feedback loop.",
        site_name: "Quantified Intuitions",
        images: [
          {
            url: "https://www.quantifiedintuitions.org/og.png",
            width: 1024,
            height: 1024,
          },
        ],
      }}
      additionalLinkTags={[
        {
          rel: "icon",
          href: "https://www.quantifiedintuitions.org/scale.svg",
        },
      ]}
    />
  );
};
