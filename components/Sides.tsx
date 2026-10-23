"use client";

import { useEffect } from "react";
import { About } from "@/components/album/About";
import { HiddenTrack, LifeGoals, NextRelease } from "@/components/album/AfterTracks";
import { Credits } from "@/components/album/Credits";
import { Discography } from "@/components/album/Discography";
import { Tracklist } from "@/components/album/Tracklist";
import { LOVES } from "@/data/loves";
import { TRACKS } from "@/data/tracks";
import { restoreSide, useDeck } from "@/lib/vinyl/deck";

/** Everything below the turntable belongs to whichever side is facing up. */
export function Sides() {
  const { side } = useDeck();

  // A link to #side-b opens with Side B already up.
  useEffect(restoreSide, []);

  if (side === "B")
    return (
      <>
        <Tracklist key="B" tracks={LOVES} side="B" />
        <LifeGoals />
      </>
    );
  return (
    <>
      <About />
      <Tracklist key="A" tracks={TRACKS} side="A" />
      <Credits />
      <HiddenTrack />
      <Discography />
      <NextRelease />
    </>
  );
}
