/**
 * api.types.ts
 * Generic API contract types for Pulse Messenger's HTTP and WebSocket layers.
 */

// ---------------------------------------------------------------------------
// Enumerations / unions
// ---------------------------------------------------------------------------

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

// ---------------------------------------------------------------------------
// HTTP response wrappers
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  readonly data: T;
  readonly success: boolean;
  readonly message?: string;
  /** ISO-8601 timestamp of when the server produced the response. */
  readonly timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<readonly T[]> {
  /** All matching items for the current page (replaces the base `data` field). */
  readonly items: readonly T[];
  /** Total number of records across all pages. */
  readonly total: number;
  /** 1-based current page index. */
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Error shape
// ---------------------------------------------------------------------------

export interface ApiError {
  /** Machine-readable error code, e.g. "AUTH_TOKEN_EXPIRED". */
  readonly code: string;
  /** Human-readable description intended for logging (not necessarily user-facing). */
  readonly message: string;
  /** Optional structured validation errors or extra diagnostic data. */
  readonly details?: Readonly<Record<string, unknown>>;
}

// ---------------------------------------------------------------------------
// Zustand store slice helpers
// ---------------------------------------------------------------------------

/**
 * Wraps a data type with request lifecycle metadata.
 * Intended as the standard shape for every Zustand async slice.
 */
export interface StoreSliceStatus<T> {
  readonly data: T;
  readonly status: RequestStatus;
  readonly error: string | null;
}

// ---------------------------------------------------------------------------
// WebSocket
// ---------------------------------------------------------------------------

export interface WebSocketEvent<T> {
  /** Discriminator string, e.g. "message.new" or "chat.typing". */
  readonly type: string;
  readonly payload: T;
  /** ISO-8601 timestamp set by the server when the event was emitted. */
  readonly timestamp: string;
}
