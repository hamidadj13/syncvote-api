import { body, check, ValidationChain } from 'express-validator';

export const validateCreateUser = [
    body('email').isEmail().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('username').notEmpty().withMessage('Username is required'),
];

export const validateLoginUser = [
    body('email').isEmail().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const validateChangePassword = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Old password required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('The new password must contain at least 8 characters !!'),
];


export const validateUpdateUser = [
    check('email')
        .optional()
        .isEmail()
        .withMessage("Email format is invalid !!"),

    check('username')
        .optional()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Username must contain at least 3 characters !!"),

    check('role')
        .optional()
        .custom((value, { req }) => {
            if (req.userRole !== 'admin') {
                throw new Error("Only admins can update the role !!");
            }
            if (!['member', 'admin'].includes(value)) {
                throw new Error("Le rôle doit être 'member' ou 'admin'");
            }
            return true;
        })
] as ValidationChain[];

//---------------------------------------------------------------------------

export const validateCreatePost = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),

    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string'),

    body('categories')
        .isArray({ min: 1 })
        .withMessage('At least one category is required')
        .custom((categories) =>
            categories.every((category: string) => typeof category === 'string')
        )
        .withMessage('All categories must be strings'),
]; 

export const validateUpdatePost = [
    check('email')
        .optional()
        .isEmail()
        .withMessage("Email format is invalid !!"),

    check('username')
        .optional()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Username must contain at least 3 characters !!"),

    check('role')
        .optional()
        .custom((value, { req }) => {
            if (req.user.role !== 'admin') {
                throw new Error("Only admins can update the role !!");
            }
            if (!['member', 'admin'].includes(value)) {
                throw new Error("Le rôle doit être 'member' ou 'admin'");
            }
            return true;
        })
] as ValidationChain[];

//---------------------------------------------------------------------------

export const validateCreateComment = [
    body('content').notEmpty().withMessage('Content is required'),
];

export const validateUpdateComment = [
    body('content').notEmpty().withMessage('Content is required'),
];