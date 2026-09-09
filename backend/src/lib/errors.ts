export const ERROR_MESSAGES = {
  VALIDATION: {
    CKD_STAGE_INVALID: 'CKD stage must be an integer between 1 and 5.',
    INVALID_LAB_VALUE: 'Lab values must be positive numbers.',
    MEAL_SCHEMA: {
          DESC_REQUIRED: 'Meal description is required and must be at least 3 characters.',
          CONSUMED_REQUIRED: '"consumedSoup" is required if "isSoup" is provided',
    },
  },
  AI: {
    EMPTY_RESPONSE: 'Gemini returned an empty response payload.',
    ANALYSIS_FAILED: 'Failed to generate structured meal analysis from AI service.',
    INVALID_SCHEMA: 'AI response failed runtime schema validation.',
  },
  HTTP: {
    INTERNAL_SERVER_ERROR: 'An unexpected internal server error occurred.',
    REQUEST_VALIDATION_ERROR: "Bad Request: Incorrect or incomplete fields",
    BAD_REQUEST: 'Invalid request payload submitted.',
  },
} as const;