/**
 * media.types.ts
 * Domain types for media handling in Pulse Messenger
 * (local capture, upload pipeline, attachment picker).
 */

// ---------------------------------------------------------------------------
// Enumerations / unions
// ---------------------------------------------------------------------------

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'voice';

/** Lifecycle state of a media upload. */
export type UploadStatus = 'idle' | 'uploading' | 'done' | 'failed';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface MediaItem {
  readonly id: string;
  readonly type: MediaType;
  /** Local filesystem or in-memory URI (e.g. `file://…` or `content://…`). */
  readonly uri: string;
  /** CDN or server URL; absent until the upload completes successfully. */
  readonly url?: string;
  readonly thumbnailUri?: string;
  /** File size in bytes. */
  readonly size: number;
  readonly mimeType: string;
  readonly uploadStatus: UploadStatus;
  /**
   * Upload progress as an integer in the range [0, 100].
   * Meaningful only when uploadStatus is 'uploading'.
   */
  readonly uploadProgress: number;
  readonly createdAt: Date;
}

/** Real-time state of the voice-message recorder. */
export interface VoiceRecordingState {
  readonly isRecording: boolean;
  readonly isPaused: boolean;
  /** Elapsed recording time in seconds. */
  readonly duration: number;
  /** Amplitude samples collected during recording, used for live waveform rendering. */
  readonly waveform: readonly number[];
  /** Local URI available once the recording session finishes. */
  readonly uri?: string;
}

/** A single item returned by the system attachment/media picker. */
export interface AttachmentPickerItem {
  readonly id: string;
  readonly type: MediaType;
  /** Local URI provided by the OS picker. */
  readonly uri: string;
  readonly fileName?: string;
  /** File size in bytes. */
  readonly size: number;
  readonly mimeType: string;
  /** Pixel width; present for images and videos. */
  readonly width?: number;
  /** Pixel height; present for images and videos. */
  readonly height?: number;
  /** Duration in seconds; present for video, audio, and voice items. */
  readonly duration?: number;
}
