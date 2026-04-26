export const {
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED,
    VALIDATION_FAILED,
    FORBIDDEN,
    THE_RESOURCE,
} =
    {
        INTERNAL_SERVER_ERROR: 'An unexpected internal server error occurred',
        VALIDATION_FAILED: 'The provided data is invalid or incomplete',
        THE_RESOURCE: 'The requested resource',
        NOT_FOUND: 'was not found',
        UNAUTHORIZED: 'You are not authorized to perform this action',
        FORBIDDEN: 'You do not have permission to access this resource',
    } as const;