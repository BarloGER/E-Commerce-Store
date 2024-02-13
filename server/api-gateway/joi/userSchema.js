import Joi from "joi";

const namePattern = /^[A-Za-zäöüßÄÖÜéèêëîïôœùûüÿçñáíóúýàèìòùÁÍÓÚÝÀÈÌÒÙ\-'. ]+$/;

export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required().messages({
    "string.alphanum":
      "Der Benutzername sollte aus alphanumerischen Zeichen bestehen.",
    "string.min":
      "Der Benutzername muss mindestens {#limit} Zeichen lang sein.",
    "string.max": "Der Benutzername darf höchstens {#limit} Zeichen lang sein.",
    "string.empty": "Der Benutzername darf nicht leer sein.",
    "any.required": "Der Benutzername ist ein Pflichtfeld.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "de"] } })
    .required()
    .messages({
      "string.email": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      "string.empty": "Die E-Mail darf nicht leer sein.",
      "any.required": "Die E-Mail ist ein Pflichtfeld.",
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      ),
    )
    .required()
    .messages({
      "string.min": "Das Passwort muss mindestens {#limit} Zeichen lang sein.",
      "string.max": "Das Passwort darf höchstens {#limit} Zeichen lang sein.",
      "string.pattern.base":
        "Das Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
      "string.empty": "Das Passwort darf nicht leer sein.",
      "any.required": "Das Passwort ist ein Pflichtfeld.",
    }),
  first_name: Joi.string().max(100).pattern(namePattern).required().messages({
    "string.max": "Der Vorname darf höchstens {#limit} Zeichen lang sein.",
    "string.pattern.base": "Der Vorname enthält unzulässige Zeichen.",
    "any.required": "Der Vorname ist ein Pflichtfeld.",
  }),
  last_name: Joi.string().max(100).pattern(namePattern).required().messages({
    "string.max": "Der Nachname darf höchstens {#limit} Zeichen lang sein.",
    "string.pattern.base": "Der Nachname enthält unzulässige Zeichen.",
    "any.required": "Der Nachname ist ein Pflichtfeld.",
  }),
});
