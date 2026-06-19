"use client";



import { useMemo, useEffect, useRef } from "react";

import { formatConsumptionDateHeader } from "./use-consumption-logs";

import { ConsumptionEntryRow } from "./consumption-entry-row";

import type { ConsumptionLog } from "@/types/consumption";

import { cn } from "@/lib/utils";



interface ConsumptionListProps {

  logs: ConsumptionLog[];

  loading?: boolean;

  error?: string | null;

  highlightDate?: string | null;

}



export function ConsumptionList({

  logs,

  loading = false,

  error = null,

  highlightDate = null,

}: ConsumptionListProps) {

  const scrollRef = useRef<HTMLDivElement>(null);



  const { sortedDates, logsByDate } = useMemo(() => {

    const map = new Map<string, ConsumptionLog[]>();

    for (const log of logs) {

      const list = map.get(log.consumed_on) ?? [];

      list.push(log);

      map.set(log.consumed_on, list);

    }



    const dates = [...map.keys()].sort((a, b) => b.localeCompare(a));

    return { sortedDates: dates, logsByDate: map };

  }, [logs]);



  useEffect(() => {

    if (!highlightDate) return;



    const frame = requestAnimationFrame(() => {

      const section = document.getElementById(`consumption-day-${highlightDate}`);

      section?.scrollIntoView({ behavior: "smooth", block: "center" });

    });



    return () => cancelAnimationFrame(frame);

  }, [highlightDate, sortedDates]);



  if (loading && logs.length === 0) {

    return (

      <div className="flex-1 min-h-0 h-full overflow-y-auto consumption-scrollbar p-4 space-y-6 animate-pulse">

        {Array.from({ length: 3 }).map((_, i) => (

          <div key={i} className="space-y-2">

            <div className="h-3 w-40 bg-muted rounded" />

            <div className="h-11 bg-muted/50 rounded-lg" />

            <div className="h-11 bg-muted/50 rounded-lg" />

          </div>

        ))}

      </div>

    );

  }



  if (error) {

    return (

      <div className="flex-1 min-h-0 h-full overflow-y-auto consumption-scrollbar">

        <p className="p-6 text-sm text-destructive">{error}</p>

      </div>

    );

  }



  if (sortedDates.length === 0) {

    return (

      <div className="flex-1 min-h-0 h-full overflow-y-auto consumption-scrollbar flex items-center justify-center">

        <p className="p-8 text-sm text-muted-foreground text-center">No entries yet.</p>

      </div>

    );

  }



  return (

    <div

      ref={scrollRef}

      className="flex-1 min-h-0 h-full overflow-y-auto consumption-scrollbar px-4 py-4 max-w-3xl mx-auto w-full"

    >

      {sortedDates.map((dateKey) => {

        const isHighlighted = highlightDate === dateKey;



        return (

          <section

            key={dateKey}

            id={`consumption-day-${dateKey}`}

            className={cn(

              "mb-8 rounded-lg px-2 -mx-2 transition-colors",

              isHighlighted && "consumption-day-highlight"

            )}

          >

            <div className="flex items-center gap-3 mb-2 px-1">

              <h3

                className={cn(

                  "text-sm font-medium tracking-wide shrink-0 transition-colors",

                  isHighlighted ? "text-foreground" : "text-muted-foreground"

                )}

              >

                {formatConsumptionDateHeader(dateKey)}

              </h3>

              <div className="flex-1 h-px bg-border/80" />

            </div>

            <div className="divide-y divide-border/50">

              {(logsByDate.get(dateKey) ?? []).map((log) => (

                <ConsumptionEntryRow key={log.id} log={log} />

              ))}

            </div>

          </section>

        );

      })}

    </div>

  );

}


