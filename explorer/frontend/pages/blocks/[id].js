import { useRouter } from "next/router";
import BlockDetail from "../../components/BlockDetail";
import Header from "../../components/header";

const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});

export default function BlockDetailPage({ result }) {
  return (
    <>
      <Header />
      <BlockDetail result={result._source} />
    </>
  );
}

export async function getServerSideProps(context) {
  // const id = context.query.id;
  // // console.log(id);
  // const request = await fetch(`http://localhost:9052/blocks/${id}`).then(
  //   (response) => response.json()
  // );
  // // console.log(request);
  // return {
  //   props: {
  //     result: request,
  //   },
  // };
  const id = context.query.id;
  // get transaction from elasticsearch
  const { body } = await client.search({
    index: "ergo_block_detail",
    body: {
      query: {
        match: {
          "header.id": id,
        },
      },
    },
  });

  const result = body.hits.hits;
  console.log(result[0]);

  return {
    props: {
      result: result[0],
    },
  };
}
