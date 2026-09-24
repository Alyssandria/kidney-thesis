export const ERROR_MESSAGES = {
  VALIDATION: {
    CKD_STAGE_INVALID: "CKD stage must be an integer between 1 and 5.",
    INVALID_LAB_VALUE: "Lab values must be positive numbers.",
    MEAL_SCHEMA: {
      DESC_REQUIRED:
        "Meal description is required and must be at least 3 characters.",
      DESC_TOO_LONG: "Meal description must be 1000 characters or fewer.",
      CONSUMED_REQUIRED: '"consumedSoup" is required if "isSoup" is provided',
    },
  },
  HTTP: {
    INTERNAL_SERVER_ERROR: "An unexpected internal server error occurred.",
    REQUEST_VALIDATION_ERROR: "Bad Request: Incorrect or incomplete fields",
    BAD_REQUEST: "Invalid request payload submitted.",
    MALFORMED_JSON: "The request body is not valid JSON.",
  },
} as const;

// Messages here are sent to clients; causes are only logged.
const APP_ERRORS = {
  AI_UNAVAILABLE: {
    status: 503,
    message:
      "The meal analysis service is unavailable right now. Please try again in a moment.",
  },
  AI_INVALID_RESPONSE: {
    status: 502,
    message: "The meal analysis came back incomplete. Please try again.",
  },
  DATABASE_UNAVAILABLE: {
    status: 503,
    message: "Your meal log can't be reached right now. Please try again shortly.",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not found.",
  },
} as const satisfies Record<string, { status: number; message: string }>;

export type AppErrorCode = keyof typeof APP_ERRORS;

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;

  constructor(code: AppErrorCode, options?: { cause?: unknown }) {
    super(APP_ERRORS[code].message, options);
    this.name = "AppError";
    this.code = code;
    this.status = APP_ERRORS[code].status;
  }
}

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    issues?: unknown;
  };
};
