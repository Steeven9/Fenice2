import MenuButton from "@/components/menuButton";
import { Sidebar, Topbar } from "@/components/navigation";
import UserIndicator from "@/components/userIndicator";
import icon from "@/img/icon.png";
import contactLogo from "@/img/icon_contact.png";
import githubLogo from "@/img/icon_github.png";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import NextAuthProvider from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "La Compagnia della Fenice",
  description: "The site of La Compagnia della Fenice",
  authors: [{ name: "Soulsbros", url: "https://soulsbros.ch" }],
  metadataBase: new URL("https://fenice2.soulsbros.ch"),
  openGraph: {
    type: "website",
    url: "/",
    title: "La Compagnia della Fenice",
    description: "The site of La Compagnia della Fenice",
    siteName: "La Compagnia della Fenice",
    images: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en-CH" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-w-[300px] bg-main-bg dark:bg-main-bg-dark dark:text-text-white`}
      >
        <ThemeProvider attribute="class">
          <NextAuthProvider>
            <header className="p-2 dark:text-fenice-red text-black flex justify-between items-center">
              <div className="flex items-center">
                <MenuButton />

                <Link href={"/"} className="flex items-center">
                  <Image
                    src={icon}
                    width={32}
                    alt="Image of a dice"
                    className="mx-2"
                  />
                  La Compagnia della Fenice
                </Link>
              </div>

              <Topbar />

              <UserIndicator />
            </header>

            <main className="flex flex-1 mx-2 md:mx-20">
              <Sidebar />

              <div className="flex-grow p-3 max-w-full">{children}</div>
            </main>

            <footer className="flex space-x-2 p-4 items-center justify-center">
              <p>&copy;{new Date().getFullYear()} Soulsbros</p>
              <Link
                href="https://github.com/soulsbros"
                target="_blank"
                className="hover:rotate-45 transition-all"
              >
                <Image src={githubLogo} width={32} alt="GitHub logo" />
              </Link>
              <Link
                href="https://soulsbros.ch/?p=contact"
                target="_blank"
                className="hover:rotate-45 transition-all"
              >
                <Image src={contactLogo} width={32} alt="Contact logo" />
              </Link>
            </footer>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
