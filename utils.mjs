import { Joi } from 'express-validation';

export const asyncWrapper = (fn) => async (...args) => {
    try {
            return await fn(...args);
    } catch(e) {
            args[args.length - 1](e)
    }
}

export const joiCustomError = (message, key, label, value) => {
   return new Joi.ValidationError(
        "any.custom",
        [
          {
            message: message,
            path: key.split('.'),
            type: "any.custom",
            context: {
              key: key,
              label: label,
              value,
            },
          },
        ],
        value
      );
}
