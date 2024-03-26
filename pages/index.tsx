import Head from "next/head";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Button, useColorModeValue } from "@chakra-ui/react";

import {
  getLgaDataSet,
  getLgaDataSetDev,
  getStateDataSet,
  getStateDataSetDev,
} from "../util/pipeline";
import { GetStaticProps } from "next";
import { demographicData } from "../types/interface";

import Logo from "../public/img/logo.svg";
import Image from "next/image";
import InfoDisplay from "../components/mapComps/infoDisplay";
import Link from "next/link";

export default function Home({
  statespollingdata,
  lgapollingdata,
}: {
  statespollingdata: demographicData[];
  lgapollingdata: demographicData[];
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const DynamicHeader = dynamic(() => import("../components/mapComps/Map"), {
    ssr: false,
  });

  const bg = useColorModeValue("brand.lightMain", "brand.darkMain");
  const gradient = useColorModeValue(
    "linear-gradient(157deg, rgba(255,255,255,1) 0%, rgba(181,207,255,1) 72%, rgba(68,106,179,1) 100%)",
    "linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(35,48,100,1) 100%)"
  );
  useEffect(() => {
    // console.log(statespollingdata)
    console.log(document.readyState);
    document.readyState != "loading" ? setIsLoaded(true) : null;

    return () => {};
  }, [setIsLoaded, statespollingdata]);
  return (
    <Box
      bgGradient={gradient}
      className="h-fit md:h-screen flex flex-col bg-blue-50 px-10 py-3"
    >
      <Head>
        <title>Interactive Digital Dashboard</title>
        <meta
          name="description"
          content="A Product of Dotgov Solutions Limited"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center md:justify-start w-full py-2 px-5">
        <Image alt="Dotgov" src={Logo} width={40} />
        <h1 className="font-bold text-[1.3rem] mx-3 mr-auto tracking-wider">Dotgov</h1>
        <Link href={"/login"}>
          <Button bg={"black"} _hover={{}} color="white">
            Agent or Admin?
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap-reverse py-4 items-center justify-center w-full h-full relative ">
        <InfoDisplay dataset={statespollingdata} />

        <div className="relative m-4 md:m-0 h-[50vh] mx-3 md:h-full flex-1 border min-w-[330px] overflow-hidden ">
          {!isLoaded ? (
            <div className="w-full h-full bg-white absolute flex items-center justify-center">
              <div className="lds-ripple">
                <div></div>
                <div></div>
              </div>
            </div>
          ) : null}
          {isLoaded ? (
            <DynamicHeader
              dataset={statespollingdata}
              lgadataset={lgapollingdata}
            />
          ) : null}
        </div>
      </div>
      {/* <div className="flex items-center w-full py-2 px-5 justify-center">
        <h1 className="font-light text-[0.7rem] mx-3 tracking-widest">
          © 2022 Dotgov
        </h1>
      </div> */}
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const dev = process.env.NODE_ENV == "development";

  if (!dev) {
    const statespollingdata = await getStateDataSet();
    const lgapollingdata = await getLgaDataSet();
    return {
      props: { statespollingdata, lgapollingdata },
    };
  }

  const statespollingdata = getStateDataSetDev();
  const lgapollingdata = getLgaDataSetDev();
  return {
    props: { statespollingdata, lgapollingdata },
    revalidate:10
  };
};
