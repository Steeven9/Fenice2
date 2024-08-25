"use client";

import LinkButtons from "@/components/linkButtons";
import PathfinderCalendar from "@/components/pathfinderCalendar";
import {
  CURRENT_DATE_AVALOR,
  CURRENT_DATE_DA,
  EVENTS_AVALOR,
  EVENTS_DA,
} from "@/lib/calendarEvents";
import { notFound } from "next/navigation";

interface Props {
  params: { campaign: string };
}

export default function CalendarPage({ params }: Readonly<Props>) {
  const links = [
    { name: "Avalor", url: "/calendar/avalor" },
    { name: "Dark Age", url: "/calendar/darkAge" },
    { name: "Sessions", url: "/calendar/sessions" },
  ];

  if (params.campaign == "darkAge") {
    return (
      <>
        <LinkButtons selected={params.campaign} links={links} />
        <PathfinderCalendar now={CURRENT_DATE_DA} initialEvents={EVENTS_DA} />
      </>
    );
  }

  if (params.campaign == "avalor") {
    return (
      <>
        <LinkButtons selected={params.campaign} links={links} />
        <PathfinderCalendar
          now={CURRENT_DATE_AVALOR}
          initialEvents={EVENTS_AVALOR}
        />
      </>
    );
  }

  if (params.campaign == "sessions") {
    return (
      <>
        <LinkButtons selected={params.campaign} links={links} />
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FZurich&bgcolor=%23ffffff&showTitle=0&showPrint=0&showCalendars=0&showTz=0&src=ZWQ3OTNmMTM1MTIwODc5YTQ4ZjE5OWE4OWZlOTc5ZjFlYjk1NGZhY2U4NDgzNDc5YWU0ODg4ZGQxNDYyOGIwM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23C0CA33"
          width="100%"
          height="90%"
          title="Calendar"
        ></iframe>
      </>
    );
  }

  return notFound();
}
