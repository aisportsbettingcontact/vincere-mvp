/**
 * Application Constants
 * Centralized location for all magic numbers and configuration values
 */

// Layout & Spacing
export const LAYOUT = {
  MOBILE_BREAKPOINT: 768,
  BOTTOM_NAV_HEIGHT: 79,
  HEADER_HEIGHT: 64,
  CONTAINER_MAX_WIDTH: 1400,
  CONTAINER_PADDING: 16,
} as const;

// Animation Timings (ms)
export const ANIMATION = {
  SPRING_DAMPING: 20,
  SPRING_STIFFNESS: 300,
  TRANSITION_DURATION: 300,
  TOAST_DURATION: 5000,
} as const;

// Betting
export const BETTING = {
  DEFAULT_STAKE: 1,
  MIN_STAKE: 0.1,
  MAX_STAKE: 1000,
  DEFAULT_UNIT_SIZE: 100,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AGE_ACCEPTED: "edgeguide-age-accepted",
  THEME: "edgeguide-theme",
  VIEW_MODE: "viewMode",
  STAY_SIGNED_IN: "edgeguide-stay-signed-in",
} as const;

// API
export const API = {
  EDGE_FUNCTION_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Validation
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_LENGTH: 10,
} as const;

// Color Similarity Threshold
export const COLOR_SIMILARITY_THRESHOLD = 100;

// Date Formats
export const DATE_FORMATS = {
  GAME_TIME: "h:mma",
  MEMBER_SINCE: { month: "long" as const, year: "numeric" as const },
} as const;
