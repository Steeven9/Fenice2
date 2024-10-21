import { defaultEdition } from "@/lib/utils";
import {
  Archive,
  Calendar,
  File,
  Home,
  List,
  Map,
  Users,
  Volume2,
  Zap,
} from "react-feather";
import SidebarLink, { TopbarLink } from "./sidebarLink";

export function Sidebar() {
  return (
    <div id="menuPanel" className="flex min-w-fit flex-col mr-5 hidden">
      <SidebarLink name="Home" href="/" icon={<Home />} />
      <hr />
      <SidebarLink name="Campaigns" href="/campaigns" icon={<Archive />} />
      <SidebarLink name="Characters" href="/characters" icon={<Users />} />
      <hr />
      <SidebarLink name="Calendar" href="/calendar" icon={<Calendar />} />
      <SidebarLink
        name="Documents"
        href={`/documents/${defaultEdition}`}
        icon={<File />}
      />
      <SidebarLink name="Initiative" href="/initiative" icon={<List />} />
      <SidebarLink name="Map" href="/map" icon={<Map />} />
      <SidebarLink
        name="Skills"
        href={`/skills/${defaultEdition}`}
        icon={<Zap />}
      />
      <SidebarLink name="Soundboard" href="/sounds" icon={<Volume2 />} />
    </div>
  );
}

export function Topbar() {
  return (
    <div className="hidden lg:inline-block">
      <TopbarLink name="Campaigns" href="/campaigns" icon={<Archive />} />
      <TopbarLink name="Characters" href="/characters" icon={<Users />} />
      <TopbarLink name="Calendar" href="/calendar" icon={<Calendar />} />
      <TopbarLink
        name="Documents"
        href={`/documents/${defaultEdition}`}
        icon={<File />}
      />
      <TopbarLink name="Initiative" href="/initiative" icon={<List />} />
      <TopbarLink name="Map" href="/map" icon={<Map />} />
      <TopbarLink
        name="Skills"
        href={`/skills/${defaultEdition}`}
        icon={<Zap />}
      />
      <TopbarLink name="Soundboard" href="/sounds" icon={<Volume2 />} />
    </div>
  );
}
