import { CONFIG } from 'src/global-config';
// import { useGetEvents } from 'src/actions/event';

import { EventListView } from 'src/sections/event/view/event-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Event list - ${CONFIG.appName}` };

export default function Page() {
  // const { events, eventsLoading} = useGetEvents();

  return (
    <>
      <title>{metadata.title}</title>
      <EventListView /> 
    </>
  );
}
