import { GetStaticProps } from "next";
import { useRouter } from "next/router";

export default function Episode(){

  const router = useRouter();

  return(
   <h1></h1>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60 * 60 *24, //24horas
  }
}