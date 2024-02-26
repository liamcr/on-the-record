/**
 * UserCondensed is a representation of a user with only
 * the fields relevant to a given post.
 */
export interface UserCondensed {
  /**
   * The ID of the user, as assigned by auth0.
   */
  id: string;
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
  /**
   * The date the user was created on.
   */
  createdOn: Date;
  /**
   * The number of followers a user has.
   */
  followers: number;
  /**
   * The number of users a user is following.
   */
  following: number;
  /**
   * The number of reviews a user has created.
   */
  reviews?: number;
  /**
   * The number of lists a user has created.
   */
  lists?: number;
  /**
   * Is the currently logged-in user following this user?
   */
  isFollowing?: boolean;
  /**
   * The music notes associated with the user
   */
  musicNotes: MusicNote[];
}

export interface MusicNote extends Entity {
  /**
   * Prompt for the music note, e.g. "Favourite Song"
   */
  prompt: string;
}

export interface Entity {
  /**
   * Deezer ID of the entity (track, album, artist)
   */
  entityId?: string;
  /**
   * src for the image corresponding to the title and subtitle
   */
  imageSrc: string;
  /**
   * Title for the music opinion. Either the song name, album name, or artist name
   */
  title: string;
  /**
   * Subtitle of the music opinion. Always the artist name
   */
  subtitle?: string;
  /**
   * Link to send the user to when they see this entity. Optional, and typically used for users.
   */
  href?: string;
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
   * The ID of the entity being reviewed
   */
  entityId: string;
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
export interface ListElement {
  /**
   * The ID of the entity corresponding to this list element
   */
  entityId: string;
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
  id: string;
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

/**
 * Represents a post, either a review or a list
 */
export interface TimelineResponse {
  /**
   * The author of the post
   */
  author: UserCondensed;
  /**
   * The timestamp at which the post was created
   */
  timestamp: string;
  /**
   * The post type, either review or list
   */
  type: PostType;
  /**
   * The data contained within the post
   */
  data: any;
}

export enum EntityType {
  Track,
  Album,
  Artist,
  User,
}

export enum PostType {
  Review,
  List,
}
