import contactLogo from "@/img/icon_contact.png";
import githubLogo from "@/img/icon_github.png";
import { defaultEdition } from "@/lib/skills";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  Calendar,
  File,
  Globe,
  Home,
  List,
  Map,
  Octagon,
  Users,
  Zap,
} from "react-feather";
import SidebarLink from "./sidebarLink";

export default function Sidebar() {
  return (
    <div
      id="menuPanel"
      className="min-w-fit flex-col justify-between hidden sm:flex mr-5"
    >
      <div>
        <SidebarLink name="Home" path="/" icon={<Home />} />
        <hr />
        <SidebarLink name="Campaigns" path="/campaigns" icon={<Archive />} />
        <SidebarLink name="Characters" path="/characters" icon={<Users />} />
        <SidebarLink name="NPCs" path="/npcs" icon={<Users />} />
        <hr />
        <SidebarLink name="Alignment" path="/alignment" icon={<Octagon />} />
        <SidebarLink name="Calendar" path="/calendar" icon={<Calendar />} />
        <SidebarLink
          name="Documents"
          path={`/documents/${defaultEdition}`}
          icon={<File />}
        />
        <SidebarLink name="Initiative" path="/initiative" icon={<List />} />
        <SidebarLink name="Map" path="/map" icon={<Map />} />
        <SidebarLink
          name="Skills"
          path={`/skills/${defaultEdition}`}
          icon={<Zap />}
        />
        {/* <SidebarLink name="Table" path="/table" icon={<Grid />} /> */}
        <hr />
        <SidebarLink
          name="Old site &#x2197;"
          path="https://lafenice.soulsbros.ch"
          icon={<Globe />}
          newTab
        />
        <SidebarLink
          name="Session plan &#x2197;"
          path="https://docs.google.com/spreadsheets/d/1ky-ZVUt-5uiXDzWmEgrUA_-vLs_LyRrNxUykBOKSPTM"
          icon={<Calendar />}
          newTab
        />
      </div>

      <div className="flex space-x-2 p-4 items-center">
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
      </div>
    </div>
  );
}
