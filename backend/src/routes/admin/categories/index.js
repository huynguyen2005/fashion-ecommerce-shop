const express = require("express");
const asyncHandler = require("express-async-handler");
const { authentication } = require("../../../middlewares/auth.middleware");
const { authorize } = require("../../../middlewares/authorize.middleware");
const validate = require("../../../middlewares/validate.middleware");
const {
  createCategory: createCategoryValidation,
  updateCategory: updateCategoryValidation,
} = require("../../../validations/category.validation");
const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../../controllers/category.controller");

const router = express.Router();

router.use(authentication);
router.use(authorize("admin"));

/**
 * @swagger
 * tags:
 *   - name: Admin Categories
 *     description: Admin-only category management endpoints
 */

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Create category successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryDetailResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden — admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Category name or slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  validate(createCategoryValidation),
  asyncHandler(createCategory),
);

/**
 * @swagger
 * /admin/categories/{id}:
 *   patch:
 *     summary: Update an existing category
 *     tags: [Admin Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68458d7d0b9f0b3b9947a111
 *         description: Category MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Update category successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryDetailResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden — admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Category name or slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id",
  validate(updateCategoryValidation),
  asyncHandler(updateCategory),
);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Soft delete a category
 *     tags: [Admin Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68458d7d0b9f0b3b9947a111
 *         description: Category MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Delete category successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BooleanSuccessResponse'
 *       403:
 *         description: Forbidden — admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", asyncHandler(deleteCategory));

module.exports = router;
