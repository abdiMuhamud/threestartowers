"use client";

import "@photo-sphere-viewer/core/index.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import type { StereoPlugin } from "@photo-sphere-viewer/stereo-plugin";
import type { TourScene } from "@/content/properties";

// Still renders are not panoramas, so they are placed on the sphere as a window
// this many degrees wide and the camera is kept inside it.
const STILL_RENDER_FOV = 85;

// Autoplay: how far (radians) the camera sweeps across a still render, and how long each move takes.
const SWEEP = 0.24;
const SWEEP_MS = 9000;
const QUARTER_TURN_MS = 7000;

type Props = { name: string; scenes: TourScene[]; backHref?: string };

export default function TourViewer({ name, scenes, backHref }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gyro, setGyro] = useState<"unsupported" | "off" | "on">("unsupported");
  // The tour plays by itself; touching the view hands control to the visitor.
  const [playing, setPlaying] = useState(true);

  const scene = scenes[index];
  const full = scene.kind === "360";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [{ Viewer }, { GyroscopePlugin }, { StereoPlugin }, { VisibleRangePlugin }] = await Promise.all([
        import("@photo-sphere-viewer/core"),
        import("@photo-sphere-viewer/gyroscope-plugin"),
        import("@photo-sphere-viewer/stereo-plugin"),
        import("@photo-sphere-viewer/visible-range-plugin"),
      ]);
      if (cancelled || !container.current) return;

      const v = new Viewer({
        container: container.current,
        panorama: `/images/${scene.image}.jpg`,
        navbar: false,
        loadingTxt: "",
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
        ...(full
          ? { defaultZoomLvl: 30, plugins: [GyroscopePlugin, StereoPlugin] }
          : {
              // Vertical field of view narrow enough that the edges of the render never show.
              minFov: 22,
              maxFov: 40,
              defaultZoomLvl: 0,
              panoData: (image: HTMLImageElement) => {
                const fullWidth = Math.round((image.width * 360) / STILL_RENDER_FOV);
                const fullHeight = Math.round(fullWidth / 2);
                return {
                  fullWidth,
                  fullHeight,
                  croppedWidth: image.width,
                  croppedHeight: image.height,
                  croppedX: Math.round((fullWidth - image.width) / 2),
                  croppedY: Math.round((fullHeight - image.height) / 2),
                };
              },
              plugins: [[VisibleRangePlugin, { usePanoData: true }]],
            }),
      });

      v.addEventListener("ready", () => !cancelled && setLoading(false), { once: true });
      viewer.current = v;

      if (full) {
        const supported = await v.getPlugin<GyroscopePlugin>(GyroscopePlugin).isSupported();
        if (!cancelled) setGyro(supported ? "off" : "unsupported");
      }
    })();

    return () => {
      cancelled = true;
      viewer.current?.destroy();
      viewer.current = null;
    };
  }, [scene, full]);

  // Autoplay: drift through the current room, then move on to the next one.
  useEffect(() => {
    const v = viewer.current;
    if (!playing || loading || !v) return;
    let stopped = false;

    (async () => {
      let finished: boolean;
      if (full) {
        finished = true;
        for (let quarter = 0; quarter < 4 && finished && !stopped; quarter++) {
          finished = await v.animate({ yaw: v.getPosition().yaw + Math.PI / 2, pitch: 0, speed: QUARTER_TURN_MS });
        }
      } else {
        v.rotate({ yaw: -SWEEP, pitch: 0 });
        v.zoom(0);
        finished = await v.animate({ yaw: SWEEP, pitch: 0, zoom: 45, speed: SWEEP_MS });
      }
      if (stopped || !finished) return;
      if (scenes.length > 1) {
        setLoading(true);
        setGyro("unsupported");
        setIndex((i) => (i + 1) % scenes.length);
      } else {
        setPlaying(false);
      }
    })();

    return () => {
      stopped = true;
      v.stopAnimation();
    };
  }, [playing, loading, full, scenes.length]);

  const go = (next: number) => {
    setLoading(true);
    setGyro("unsupported");
    setIndex(next);
  };

  const toggleGyro = async () => {
    const { GyroscopePlugin } = await import("@photo-sphere-viewer/gyroscope-plugin");
    const plugin = viewer.current?.getPlugin<GyroscopePlugin>(GyroscopePlugin);
    if (!plugin) return;
    setPlaying(false);
    if (plugin.isEnabled()) {
      plugin.stop();
      setGyro("off");
    } else {
      await plugin.start().then(
        () => setGyro("on"),
        () => setGyro("unsupported"), // permission refused
      );
    }
  };

  const enterHeadset = async () => {
    const { StereoPlugin } = await import("@photo-sphere-viewer/stereo-plugin");
    setPlaying(false);
    viewer.current?.getPlugin<StereoPlugin>(StereoPlugin)?.start().catch(() => {});
  };

  return (
    <div className="tour">
      <div ref={container} className="tour__view" onPointerDown={() => setPlaying(false)} />
      {loading && <div className="tour__loading">Loading {scene.title.toLowerCase()}…</div>}

      <div className="tour__top">
        {backHref && (
          <Link href={backHref} className="tour__pill" aria-label="Back to residence">
            ← Back
          </Link>
        )}
        <div className="tour__title">
          <strong>{scene.title}</strong>
          <span>{name}</span>
        </div>
        <button className={`tour__pill${playing ? " is-on" : ""}`} onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
          {playing ? "❚❚ Pause" : "▶ Play"}
        </button>
        {full && gyro !== "unsupported" && (
          <button className={`tour__pill${gyro === "on" ? " is-on" : ""}`} onClick={toggleGyro}>
            {gyro === "on" ? "Motion on" : "Move phone to look"}
          </button>
        )}
        {full && gyro !== "unsupported" && (
          <button className="tour__pill tour__pill--gold" onClick={enterHeadset}>
            VR headset
          </button>
        )}
      </div>

      <div className="tour__bottom">
        <p className="tour__hint">
          {playing
            ? "Playing automatically · touch the view to look around yourself"
            : full
              ? "Drag to look all the way round · press Play to resume the tour"
              : "Drag to look around · press Play to resume the tour"}
        </p>
        <div className="tour__scenes" role="tablist" aria-label="Rooms">
          {scenes.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={i === index} className={i === index ? "is-on" : ""} onClick={() => go(i)}>
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
