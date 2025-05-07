const { Router } = require("express");
const router = Router();

const authRouter = require("./authRoutes");
const campaignRouter = require("./campaignRoutes");
const transactionRouter = require("./transactionRoutes.js");
const superadmin = require("./SuperAdmin.Routers.js");
const contact = require("./contactRoutes.js");

const routes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/campaigns",
    route: campaignRouter,
  },
  {
    path: "/payment",
    route: transactionRouter,
  },
  {
    path: "/admin",
    route: superadmin,
  },
  {
    path: "/contact",
    route: contact,
  },
];

routes.forEach((r) => {
  router.use(r.path, r.route);
});

module.exports = router;
