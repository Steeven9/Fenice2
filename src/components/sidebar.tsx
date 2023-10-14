import Image from "next/image";
import Link from "next/link";
import { Home, List, Map, MapPin, SkipBack, Zap } from "react-feather";
import contactLogo from "../img/icon_contact.png";
import githubLogo from "../img/icon_github.png";
import SidebarLink from "./sidebarLink";

export default function Sidebar() {
  return (
    <div className="min-w-fit flex-col justify-between hidden sm:flex">
      <div>
        <SidebarLink
          name="Old site"
          path="https://lafenice.soulsbros.ch"
          icon={<SkipBack />}
        />
        <SidebarLink name="Home" path="/" icon={<Home />} />
        {/* <SidebarLink
          name="Alignment"
          path="/alignment"
          icon={<Octagon />}
        /> */}
        {/* <SidebarLink
          name="Characters"
          path="/characters"
          icon={<Users />}
        /> */}
        <SidebarLink name="Golarion map" path="/map" icon={<Map />} />
        <SidebarLink name="Initiative" path="/initiative" icon={<List />} />
        <SidebarLink name="Skills" path="/skills" icon={<Zap />} />
        {/* <SidebarLink
          name="DA Calendar"
          path="/calendar"
          icon={<Calendar />}
        /> */}
        <SidebarLink name="DA Itinerary" path="/itinerary" icon={<MapPin />} />
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