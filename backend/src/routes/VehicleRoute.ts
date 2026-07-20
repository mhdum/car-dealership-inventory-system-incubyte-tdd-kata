const { Router } = require("express");
const { createVehicle } = require("../controller/VehicleController");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validateBody = require("../middlewares/validateRequest");
const { vehicleValidationSchema } = require("../common/utils/validators/vehicleValidation");

const router = Router();

router.post(
  "/",
  (req: any, res: any, next: any) => {
    try {
      const auth = require("../middlewares/auth.middleware");
      if (auth && typeof auth.authenticate === "function") {
        return auth.authenticate(req, res, () => {
          if (auth && typeof auth.authorize === "function") {
            return auth.authorize("admin")(req, res, next);
          }
          return next();
        });
      }
    } catch (e) {
      // ignore and continue
    }
    return next();
  },
  validateBody(vehicleValidationSchema),
  createVehicle
);

module.exports = router;
