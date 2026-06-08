const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 3000;
const API_VERSION = "v1";
const API_PREFIX = `/api/${API_VERSION}`;
const routesGlob = path
  .join(__dirname, "../routes/**/*.js")
  .replace(/\\/g, "/");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Fashion Ecommerce API",
      version: "1.0.0",
      description: "REST API documentation for the Fashion Ecommerce backend.",
    },
    servers: [
      {
        url: `http://localhost:${PORT}${API_PREFIX}`,
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication and password recovery endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthUser: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "68458d7d0b9f0b3b9947a111",
            },
            fullName: {
              type: "string",
              example: "Nguyen Van A",
            },
            email: {
              type: "string",
              format: "email",
              example: "vana@example.com",
            },
          },
        },
        TokenPair: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access",
            },
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh",
            },
          },
        },
        SignUpRequest: {
          type: "object",
          required: ["fullName", "email", "password", "repeatPassword"],
          properties: {
            fullName: {
              type: "string",
              minLength: 3,
              maxLength: 30,
              example: "Nguyen Van A",
            },
            email: {
              type: "string",
              format: "email",
              example: "vana@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              maxLength: 20,
              example: "123456",
            },
            repeatPassword: {
              type: "string",
              example: "123456",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "vana@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              maxLength: 20,
              example: "123456",
            },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh",
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "vana@example.com",
            },
          },
        },
        VerifyForgotPasswordOtpRequest: {
          type: "object",
          required: ["email", "otp"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "vana@example.com",
            },
            otp: {
              type: "string",
              minLength: 6,
              maxLength: 6,
              pattern: "^\\d{6}$",
              example: "123456",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["email", "resetToken", "newPassword", "repeatPassword"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "vana@example.com",
            },
            resetToken: {
              type: "string",
              minLength: 32,
              example: "62ed29a0b0e4c66144a0d6995f519ea9f50f29209f4bb3e2e0fdb4515c6b8a72",
            },
            newPassword: {
              type: "string",
              minLength: 6,
              maxLength: 20,
              example: "newpassword123",
            },
            repeatPassword: {
              type: "string",
              example: "newpassword123",
            },
          },
        },
        AuthSuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "User login successful",
            },
            status: {
              type: "integer",
              example: 200,
            },
            metadata: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/AuthUser",
                },
                tokens: {
                  $ref: "#/components/schemas/TokenPair",
                },
              },
            },
          },
        },
        RefreshTokenSuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Token refresh successful",
            },
            status: {
              type: "integer",
              example: 200,
            },
            metadata: {
              $ref: "#/components/schemas/TokenPair",
            },
          },
        },
        BooleanSuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operation successful",
            },
            status: {
              type: "integer",
              example: 200,
            },
            metadata: {
              type: "boolean",
              example: true,
            },
          },
        },
        ForgotPasswordSuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Forgot password request successful",
            },
            status: {
              type: "integer",
              example: 200,
            },
            metadata: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "OTP has been sent to the registered email",
                },
                expiresIn: {
                  type: "integer",
                  example: 180,
                },
              },
            },
          },
        },
        VerifyOtpSuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "OTP verified successfully",
            },
            status: {
              type: "integer",
              example: 200,
            },
            metadata: {
              type: "object",
              properties: {
                resetToken: {
                  type: "string",
                  example: "62ed29a0b0e4c66144a0d6995f519ea9f50f29209f4bb3e2e0fdb4515c6b8a72",
                },
                expiresIn: {
                  type: "integer",
                  example: 600,
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            code: {
              type: "integer",
              example: 400,
            },
            message: {
              oneOf: [
                {
                  type: "string",
                  example: "Error: Invalid refresh token",
                },
                {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: {
                        type: "string",
                        example: "email",
                      },
                      message: {
                        type: "string",
                        example: "Email is required",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  apis: [routesGlob],
};

module.exports = swaggerJSDoc(options);
