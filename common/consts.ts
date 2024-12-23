import { EntityType } from "./types";

export const entityTypeStrings = ["Track", "Album", "Artist"];

export const prompts = [
  "My Favourite Artist",
  "My Favourite Album",
  "My Favourite Song",
  "My Guilty-Pleasure Artist",
  "My Guilty-Pleasure Album",
  "My Guilty-Pleasure Song",
  "Artist I've Been Into Lately",
  "Album I've Been Into Lately",
  "Song I've Been Into Lately",
  "First Song I'd Play on the AUX",
  "My Favourite Workout Song",
  "My Favourite Sad Song",
];

export const promptTypeMap = [
  EntityType.Artist,
  EntityType.Album,
  EntityType.Track,
  EntityType.Artist,
  EntityType.Album,
  EntityType.Track,
  EntityType.Artist,
  EntityType.Album,
  EntityType.Track,
  EntityType.Track,
  EntityType.Track,
  EntityType.Track,
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const guestColour = "#bababa";
export const guestSub = "guest|0";
