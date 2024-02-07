import Layout from "@/Components/Layout/Layout";
export default function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout labelHeader="Home">
      {children}
    </Layout>
  );
}
