import express from "express";
import { USER_TYPE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FaqController } from "./faq.controller";
import { FaqValidation } from "./faq.validation";
const router = express.Router();

// frequently ask question (faq);
router.post(
  "/create-faq",
  auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
  validateRequest(FaqValidation.createFaqZodSchema),
  FaqController.createFaq
);

router
  .route("/:id")
  .patch(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    validateRequest(FaqValidation.updateFaqZodSchema),
    FaqController.updateFaq
  )
  .delete(
    auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN),
    FaqController.deleteFaq
  );

router.get(
  "/",
  //auth(USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.USER),
  FaqController.getAllFaq
);

export const FaqRoutes = router;
