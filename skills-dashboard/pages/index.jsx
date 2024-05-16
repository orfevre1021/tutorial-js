import Head from "next/head";
import Header from "../components/Header";
// import TopCards from "../components/TopCards";
// import BarChart from "../components/BarChart";
// import NewPosts from "../components/NewPosts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Skills Dashboard</title>
        <meta name="description" content="Skills Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 min-h-screen">
        <Header user="Tanaka" />
        {/* <TopCards /> */}

        <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
          {/* <BarChart />
          <NewPosts title="新しい投稿" /> */}
        </div>
      </main>
    </>
  );
}
