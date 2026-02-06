const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant App",
      version: "1.0.0",
      description: "Restaurant App Backend with JWT Authentication"
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`
      }
    ],
    tags: [
      { name: "Users" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phonenumber: { type: "number" },
            address: { type: "string" },
            role: { type: "string" }
          }
        },

        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string" },
            data: {
              type: "object"
            },
            pagination: {
              type: "object",
              properties: {
                currentpage: { type: "number" },
                totalpages: { type: "number" },
                totalitems: { type: "number" },
                limit: { type: "number" },
                hasNextPage: { type: "boolean" },
                hasPreviouspage: { type: "boolean" }
              }
            }
          }
        },

        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string" },
            message: { type: "string" }
          }
        }
      }
    }
  },

  apis: ["./docs/*.js"]
};


module.exports = swaggerJsDoc(swaggerOptions);
