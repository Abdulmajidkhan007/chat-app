/**
 * user.types.ts
 * Domain types for Pulse Messenger users.
 */

// ---------------------------------------------------------------------------
// Branded ID
// ---------------------------------------------------------------------------

export type UserId = string & { readonly __brand: 'UserId' };

// ---------------------------------------------------------------------------
// Enumerations / unions
// ---------------------------------------------------------------------------

/** Presence status. 'last_seen' pairs with the `lastSeen` date field. */
export type UserStatus = 'online' | 'offline' | 'recently' | 'last_seen';

export type UserRole = 'user' | 'admin' | 'bot';

// ---------------------------------------------------------------------------
// Core interfaces
// ---------------------------------------------------------------------------

export interface User {
  readonly id: UserId;
  /** E.164-formatted phone number, e.g. "+14155552671" */
  readonly phone: string;
  readonly username?: string;
  readonly firstName: string;
  readonly lastName?: string;
  readonly bio?: string;
  readonly avatarUrl?: string;
  readonly status: UserStatus;
  /** UTC timestamp of last activity; meaningful when status is 'last_seen'. */
  readonly lastSeen: Date;
  readonly isVerified: boolean;
  readonly isBot: boolean;
  readonly role: UserRole;
  readonly createdAt: Date;
}

/** Lightweight projection used in chat lists, member lists, etc. */
export interface UserPreview {
  readonly id: UserId;
  readonly username?: string;
  readonly firstName: string;
  readonly lastName?: string;
  readonly avatarUrl?: string;
  readonly status: UserStatus;
  readonly isVerified: boolean;
}

/** Represents the authenticated session user; carries a reference to app settings. */
export interface CurrentUser extends User {
  /** Key into the user-settings store (avoids circular import of settings types). */
  readonly settingsId: string;
}
