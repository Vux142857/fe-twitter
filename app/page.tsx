import Layout from "@/Components/Layout/Layout";
import Newfeeds from "@/Components/Layout/Newfeeds";
import Form from "@/Components/Post/Form";
export default function Home() {
  return (
    <Layout labelHeader="Home">
      <Form isComment={false} />
      <Newfeeds />
    </Layout>
  );
}
