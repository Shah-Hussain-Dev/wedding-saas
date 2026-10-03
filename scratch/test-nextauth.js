require("dotenv").config();
const { authOptions } = require("./app/api/auth/[...nextauth]/route.ts");
console.log("Auth options loaded:", authOptions ? "OK" : "Failed");
