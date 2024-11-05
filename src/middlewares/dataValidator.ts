import { body, check, ValidationChain } from 'express-validator';
import { categories } from '../constants/categories';

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

// Liste des catégories valides pour comparaison
const validCategoryKeys = categories.map((category) => category.key);

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

        check('categories')
        .optional()
        .isArray({ min: 1 })
        .withMessage("Category should be an array of strings !!")
        .custom((categoryArray) => {

            // Vérifier si c'est bien un tableau de chaînes
            if (!Array.isArray(categoryArray) || !categoryArray.every(item => typeof item === 'string')) {
                throw new Error("Category should be an array of strings !!");
            }
            // Vérifier la validité de chaque catégorie
            const isValid = categoryArray.every((category) => validCategoryKeys.includes(category));
            if (!isValid) {
                throw new Error(`Invalid category provided. Please select a valid category from the following list: ${validCategoryKeys.join(', ')}`);
            }
            return true;
        })
        .withMessage(`Invalid category provided. Please select a valid category from the following list: ${validCategoryKeys.join(', ')}`)
]; 



export const validateUpdatePost = [
    check('title')
        .optional()
        .isString()
        .withMessage("Title format is invalid !!"),

    check('description')
        .optional()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Description must contain at least 3 characters !!"),

    check('categories')
        .optional()
        .isArray({ min: 1 })
        .withMessage("Category should be an array of strings !!")
        .custom((categoryArray) => {

            // Vérifier si c'est bien un tableau de chaînes
            if (!Array.isArray(categoryArray) || !categoryArray.every(item => typeof item === 'string')) {
                throw new Error("Category should be an array of strings !!");
            }
            // Vérifier la validité de chaque catégorie
            const isValid = categoryArray.every((category) => validCategoryKeys.includes(category));
            if (!isValid) {
                throw new Error(`Invalid category provided. Please select a valid category from the following list: ${validCategoryKeys.join(', ')}`);
            }
            return true;
        })
        .withMessage(`Invalid category provided. Please select a valid category from the following list: ${validCategoryKeys.join(', ')}`)
] as ValidationChain[];

//---------------------------------------------------------------------------

export const validateCreateComment = [
    body('content').notEmpty().withMessage('Content is required'),
];

export const validateUpdateComment = [
    body('content').notEmpty().withMessage('Content is required'),
];