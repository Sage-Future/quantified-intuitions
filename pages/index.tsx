import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // redirect to pastcasting
  ctx.res.writeHead(302, { Location: "/pastcasting" });
  ctx.res.end();
  return { props: {} };
};

const IndexPage = () => {
  return <div />;
};

export default IndexPage;
