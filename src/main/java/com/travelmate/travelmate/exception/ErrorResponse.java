package com.travelmate.travelmate.exception;

import java.time.LocalDateTime;
import java.util.Map;

/** Standard shape returned for any error response. */
public class ErrorResponse {
    private boolean success = false;
    private String message;
    private int status;
    private Map<String, String> fieldErrors;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse() {
    }

    public ErrorResponse(boolean success, String message, int status, Map<String, String> fieldErrors, LocalDateTime timestamp) {
        this.success = success;
        this.message = message;
        this.status = status;
        this.fieldErrors = fieldErrors;
        this.timestamp = (timestamp != null) ? timestamp : LocalDateTime.now();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public Map<String, String> getFieldErrors() { return fieldErrors; }
    public void setFieldErrors(Map<String, String> fieldErrors) { this.fieldErrors = fieldErrors; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private boolean success = false;
        private String message;
        private int status;
        private Map<String, String> fieldErrors;
        private LocalDateTime timestamp = LocalDateTime.now();

        public Builder success(boolean success) { this.success = success; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder status(int status) { this.status = status; return this; }
        public Builder fieldErrors(Map<String, String> fieldErrors) { this.fieldErrors = fieldErrors; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public ErrorResponse build() {
            return new ErrorResponse(success, message, status, fieldErrors, timestamp);
        }
    }
}
