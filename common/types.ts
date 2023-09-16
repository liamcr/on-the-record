/**
 * UserCondensed is a representation of a user with only
 * the fields relevant to a given post.
 */
export interface UserCondensed {
  /**
   * The ID of the user.
   */
  id: number;
  /**
   * The user's display name.
   */
  name: string;
  /**
   * URL for the user's profile picture.
   */
  profilePictureSrc: string;
}

/**
 * User contains all possible fields that are associated with a user.
 */
export interface User extends UserCondensed {
  /**
   * The user's chosen primary colour.
   */
  colour: string;
  // TODO: Music Opinions- but different name
}

/**
 * Review is a representation of a track/album review
 */
export interface Review {
  /**
   * The ID of the review
   */
  id: number;
  /**
   * Timestamp of when the review was submitted
   */
  timestamp: string;
  /**
   * The user that wrote the review
   */
  author: UserCondensed;
  /**
   * The title of the track or album
   */
  title: string;
  /**
   * The artist name
   */
  subtitle: string;
  /**
   * The type of review, i.e. track or album
   */
  type: EntityType;
  /**
   * The score given to the track/album (1-10)
   */
  score: number;
  /**
   * The cover art src
   */
  src: string;
  /**
   * The dominant colour of the cover art (if not provided, it is generated)
   */
  colour?: string;
  /**
   * The written review from the user (optional)
   */
  review?: string;
}

/**
 * Represents an element in a top 5 list
 */
interface ListElement {
  /**
   * Image src of the list element
   */
  src: string;
  /**
   * Name of the list element
   */
  name: string;
}

/**
 * Represents a top-5 list
 */
export interface TopFiveList {
  /**
   * The ID of the list
   */
  id: number;
  /**
   * Timestamp of when the list was submitted
   */
  timestamp: string;
  /**
   * The user that wrote the list
   */
  author: UserCondensed;
  /**
   * The title of the list (not including "Top 5")
   */
  title: string;
  /**
   * The user-selected colour of the list
   */
  colour: string;
  /**
   * The type of review, i.e. track or album
   */
  type: EntityType;
  /**
   * The items of the list
   */
  list: ListElement[];
}

export enum EntityType {
  Track,
  Album,
  Artist,
}
