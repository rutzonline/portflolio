"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Body, Engine } from "matter-js";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { RESUME_SECTION_HEADING_CLASS } from "./resume-panel-styles";

const CHARM_IMAGES = [
  "https://github.com/rutz-exe/images/blob/main/1.png?raw=true",
  "https://github.com/rutz-exe/images/blob/main/2.png?raw=true",
  "https://github.com/rutz-exe/images/blob/main/3.png?raw=true",
  "https://github.com/rutz-exe/images/blob/main/4.png?raw=true",
  "https://github.com/rutz-exe/images/blob/main/5.png?raw=true",
] as const;

const HALF = 32;
const RADIUS = 24;
const CHARM_SIZE = 64;

type BodyEntry = {
  body: Body;
  el: HTMLDivElement;
};

export function ContactCharmsPlayground({ isMobileView = false }: { isMobileView?: boolean }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const flowerLayerRef = useRef<HTMLDivElement>(null);
  const bodyMapRef = useRef<Map<number, BodyEntry>>(new Map());
  const engineRef = useRef<Engine | null>(null);
  const matterRef = useRef<typeof import("matter-js") | null>(null);
  const wallsRef = useRef<{ floor: Body; wallL: Body; wallR: Body } | null>(null);
  const rollingAwayRef = useRef(false);
  const pendingSpawnsRef = useRef<string[]>([]);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [droppedBtn, setDroppedBtn] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const incrementGlobal = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.rpc("increment_pixel_counter");
    } catch {
      // counter is best-effort
    }
  }, []);

  const createWalls = useCallback(() => {
    const Matter = matterRef.current;
    const engine = engineRef.current;
    const block = blockRef.current;
    if (!Matter || !engine || !block) return;

    const { Bodies, World } = Matter;
    const W = block.offsetWidth;
    const H = block.offsetHeight;
    const opts = { isStatic: true, friction: 1, restitution: 0.05 };

    if (wallsRef.current) {
      World.remove(engine.world, [wallsRef.current.floor, wallsRef.current.wallL, wallsRef.current.wallR]);
    }

    const floor = Bodies.rectangle(W / 2, H + 25, W * 3, 50, opts);
    const wallL = Bodies.rectangle(-25, H / 2, 50, H * 3, opts);
    const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 3, opts);
    World.add(engine.world, [floor, wallL, wallR]);
    wallsRef.current = { floor, wallL, wallR };
  }, []);

  const spawnFlower = useCallback((imgSrc: string) => {
    const Matter = matterRef.current;
    const engine = engineRef.current;
    const block = blockRef.current;
    const flowerLayer = flowerLayerRef.current;
    if (!Matter || !engine || !block || !flowerLayer) return;

    const { Bodies, Body, World } = Matter;
    const W = block.offsetWidth;
    const spawnX = HALF + Math.random() * Math.max(W - CHARM_SIZE, CHARM_SIZE);

    const body = Bodies.circle(spawnX, -40, RADIUS, {
      restitution: 0.18,
      friction: 0.65,
      frictionAir: 0.009,
      density: 0.003,
      angle: Math.random() * Math.PI * 2,
    });

    Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 1.5 + Math.random() * 2 });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
    World.add(engine.world, body);

    const el = document.createElement("div");
    el.className = "absolute pointer-events-none select-none transition-opacity duration-500";
    el.style.width = `${CHARM_SIZE}px`;
    el.style.height = `${CHARM_SIZE}px`;
    el.style.transformOrigin = "center center";
    el.innerHTML = `<img src="${imgSrc}" alt="" draggable="false" class="w-full h-full object-contain block" />`;
    flowerLayer.appendChild(el);
    bodyMapRef.current.set(body.id, { body, el });
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (!rollingAwayRef.current) {
      inactivityTimerRef.current = setTimeout(() => startRollAwayRef.current?.(), 3000);
    }
  }, []);

  const startRollAwayRef = useRef<(() => void) | null>(null);

  const startRollAway = useCallback(() => {
    const Matter = matterRef.current;
    const engine = engineRef.current;
    const block = blockRef.current;
    if (!Matter || !engine || !block || bodyMapRef.current.size === 0) return;

    const { Body, World } = Matter;
    rollingAwayRef.current = true;

    const W = block.offsetWidth;
    const H = block.offsetHeight;

    if (wallsRef.current) {
      World.remove(engine.world, wallsRef.current.wallR);
      World.remove(engine.world, wallsRef.current.floor);
    }

    const tiltedFloor = Matter.Bodies.rectangle(W / 2, H + 8, W * 4, 40, {
      isStatic: true,
      friction: 0.05,
      restitution: 0,
      angle: 0.1,
    });
    World.add(engine.world, tiltedFloor);
    wallsRef.current = {
      floor: tiltedFloor,
      wallL: wallsRef.current!.wallL,
      wallR: wallsRef.current!.wallR,
    };

    const allBodies = [...bodyMapRef.current.values()].sort(
      (a, b) => a.body.position.x - b.body.position.x
    );

    allBodies.forEach(({ body }, idx) => {
      Body.setStatic(body, false);
      window.setTimeout(() => {
        Body.setVelocity(body, { x: 10 + Math.random() * 4, y: 0 });
        Body.setAngularVelocity(body, 0.3 + Math.random() * 0.4);
      }, idx * 60);
    });

    const pusher = window.setInterval(() => {
      bodyMapRef.current.forEach(({ body }) => {
        Body.applyForce(body, body.position, { x: 0.01, y: 0 });
      });
    }, 50);

    const cleanup = window.setInterval(() => {
      bodyMapRef.current.forEach(({ body, el }, id) => {
        if (body.position.x > W + 80) {
          el.remove();
          World.remove(engine.world, body);
          bodyMapRef.current.delete(id);
        }
      });

      if (bodyMapRef.current.size === 0) {
        window.clearInterval(cleanup);
        window.clearInterval(pusher);
        rollingAwayRef.current = false;
        createWalls();
        pendingSpawnsRef.current.forEach((src) => spawnFlower(src));
        pendingSpawnsRef.current = [];
        if (bodyMapRef.current.size > 0) resetInactivityTimer();
      }
    }, 100);
  }, [createWalls, resetInactivityTimer, spawnFlower]);

  startRollAwayRef.current = startRollAway;

  const handleCharmClick = useCallback(
    async (index: number, src: string) => {
      setDroppedBtn(index);
      window.setTimeout(() => setDroppedBtn(null), 400);

      if (rollingAwayRef.current) {
        pendingSpawnsRef.current.push(src);
      } else {
        spawnFlower(src);
        resetInactivityTimer();
      }

      await incrementGlobal();
    },
    [incrementGlobal, resetInactivityTimer, spawnFlower]
  );

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    async function init() {
      const Matter = await import("matter-js");
      if (cancelled || !blockRef.current) return;

      matterRef.current = Matter;
      const engine = Matter.Engine.create({ gravity: { x: 0, y: 2.2 } });
      engineRef.current = engine;
      Matter.Runner.run(Matter.Runner.create(), engine);

      createWalls();

      Matter.Events.on(engine, "afterUpdate", () => {
        bodyMapRef.current.forEach(({ body, el }) => {
          el.style.left = `${body.position.x - HALF}px`;
          el.style.top = `${body.position.y - HALF}px`;
          el.style.transform = `rotate(${body.angle}rad)`;
        });
      });

      resizeObserver = new ResizeObserver(() => createWalls());
      resizeObserver.observe(blockRef.current);
      setReady(true);
    }

    init();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      bodyMapRef.current.forEach(({ el }) => el.remove());
      bodyMapRef.current.clear();
      if (engineRef.current && matterRef.current) {
        matterRef.current.Engine.clear(engineRef.current);
      }
    };
  }, [createWalls]);

  return (
    <div className="space-y-3">
      <div>
        <div className={RESUME_SECTION_HEADING_CLASS}>
          that&apos;s it. collect some charms and put my limitaxxing to use
        </div>
      </div>

      <div
        ref={blockRef}
        className="relative h-[260px] md:h-[300px] w-full max-w-4xl overflow-hidden cursor-crosshair"
      >
        <div ref={flowerLayerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" />

        <div
          className={cn(
            "absolute inset-x-0 top-0 z-[2] flex gap-2.5 items-center pointer-events-auto px-3 pt-1",
            isMobileView ? "flex-nowrap overflow-x-auto" : "flex-wrap"
          )}
        >
          {CHARM_IMAGES.map((src, i) => (
            <button
              key={src}
              type="button"
              disabled={!ready}
              onClick={() => handleCharmClick(i, src)}
              className={cn(
                "w-14 h-14 md:w-16 md:h-16 rounded-xl border border-zinc-200/80 dark:border-white/10",
                "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-2",
                "flex items-center justify-center transition-all",
                "hover:-translate-y-1 hover:scale-105 hover:border-zinc-300 dark:hover:border-white/20",
                "disabled:opacity-40",
                droppedBtn === i && "animate-charm-bounce"
              )}
            >
              <Image
                src={src}
                alt={`charm ${i + 1}`}
                width={48}
                height={48}
                className="w-full h-full object-contain pointer-events-none"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
