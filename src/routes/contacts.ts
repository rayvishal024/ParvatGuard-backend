import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/emergencyContactController";
import { authenticate } from "../middleware/auth";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

router.use(authenticate);
router.use(apiLimiter);

const createContactSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).required(),
    phone: Joi.string().required(),
    relationship: Joi.string().optional(),
    is_primary: Joi.boolean().optional(),
  }),
};

const updateContactSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).optional(),
    phone: Joi.string().optional(),
    relationship: Joi.string().optional(),
    is_primary: Joi.boolean().optional(),
  }),
};

router.get("/", getContacts);
router.post("/", celebrate(createContactSchema), createContact);
router.put("/:id", celebrate(updateContactSchema), updateContact);
router.delete("/:id", deleteContact);

export default router;
