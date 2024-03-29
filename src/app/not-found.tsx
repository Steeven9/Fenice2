import notFound from "@/img/notFound.png";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <p className="title">404 - Not Found</p>
      <p className="mb-5">Looks like you failed a Survival check.</p>
      <Image src={notFound} alt="Not found image" className="mb-6" />
      <Link href="/" className="primary button">
        Back home
      </Link>
    </>
  );
}
