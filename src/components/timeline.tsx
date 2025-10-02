import type { LifecycleEvent } from '@/lib/definitions';
import {
  ArrowRightLeft,
  CalendarDays,
  CheckCircle,
  FilePlus,
  Recycle,
  Wrench,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const eventIcons: Record<
  LifecycleEvent['type'],
  React.ReactElement
> = {
  creation: <FilePlus className="h-5 w-5" />,
  transfer: <ArrowRightLeft className="h-5 w-5" />,
  repair: <Wrench className="h-5 w-5" />,
  recycling: <Recycle className="h-5 w-5" />,
};

const eventTitles: Record<LifecycleEvent['type'], string> = {
  creation: 'Device Registered',
  transfer: 'Ownership Transferred',
  repair: 'Repair Logged',
  recycling: 'Device Recycled',
};

function TimelineItem({ event, isLast }: { event: LifecycleEvent; isLast: boolean }) {
  const Icon = eventIcons[event.type];
  const title = eventTitles[event.type];

  return (
    <div className="relative flex items-start gap-6">
      <div className="flex flex-col items-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
          {Icon}
        </div>
        {!isLast && (
          <div className="w-px flex-grow bg-border"></div>
        )}
      </div>
      <div className="flex-1 pb-10">
        <Card className="shadow-md transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(event.timestamp).toLocaleString()}
                </CardDescription>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              {event.type === 'creation' && (
                <p>Device created by <strong>{event.details.manufacturer}</strong>.</p>
              )}
              {event.type === 'transfer' && (
                <>
                  <p>From: <strong>{event.details.from}</strong></p>
                  <p>To: <strong>{event.details.to}</strong></p>
                </>
              )}
              {event.type === 'repair' && (
                <>
                  <p>Service Provider: <strong>{event.details.serviceProvider}</strong></p>
                  <p>Description: {event.details.description}</p>
                  {event.details.replacedParts && event.details.replacedParts.length > 0 && (
                     <p>Parts Replaced: {event.details.replacedParts.join(', ')}</p>
                  )}
                </>
              )}
               {event.type === 'recycling' && (
                <>
                  <p>Recycled By: <strong>{event.details.recycledBy}</strong></p>
                  <p>Notes: {event.details.notes}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function Timeline({ events }: { events: LifecycleEvent[] }) {
    if (!events || events.length === 0) {
        return <p>No history available for this device.</p>
    }
  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
        />
      ))}
    </div>
  );
}
