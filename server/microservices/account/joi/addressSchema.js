import Joi from "joi";

// ToDo: Check valid address_type options
// ToDo: Add function to detect Country and add rules for zip code based on the country

export const addressSchema = Joi.object({
  address_id: Joi.number().messages({
    "any.required": "Die Id wird benötigt",
  }),
  effective_date: Joi.date().iso().required().messages({
    "date.base": "Das Datum muss im ISO-Format sein.",
    "any.required": "Das Datum ist ein Pflichtfeld.",
  }),
  address_type: Joi.string()
    .valid("home", "work", "other")
    .required()
    .messages({
      "any.only": "Der Adresstyp muss 'home', 'work' oder 'other' sein.",
      "any.required": "Der Adresstyp ist ein Pflichtfeld.",
    }),
  address_line1: Joi.string().max(255).required().messages({
    "string.max":
      "Die Adresszeile 1 darf höchstens {#limit} Zeichen lang sein.",
    "any.required": "Die Adresszeile 1 ist ein Pflichtfeld.",
  }),
  address_line2: Joi.string().max(255).allow("").optional().messages({
    "string.max":
      "Die Adresszeile 2 darf höchstens {#limit} Zeichen lang sein.",
  }),
  city: Joi.string().max(100).required().messages({
    "string.max": "Die Stadt darf höchstens {#limit} Zeichen lang sein.",
    "any.required": "Die Stadt ist ein Pflichtfeld.",
  }),
  country: Joi.string().max(100).required().messages({
    "string.max": "Das Land darf höchstens {#limit} Zeichen lang sein.",
    "any.required": "Das Land ist ein Pflichtfeld.",
  }),
  zip: Joi.string()
    .max(20)
    .pattern(new RegExp("^[0-9A-Z]+(?:[-\\s][0-9A-Z]+)*$"))
    .required()
    .messages({
      "string.max":
        "Die Postleitzahl darf höchstens {#limit} Zeichen lang sein.",
      "string.pattern.base": "Die Postleitzahl muss ein gültiges Format haben.",
      "any.required": "Die Postleitzahl ist ein Pflichtfeld.",
    }),
});
