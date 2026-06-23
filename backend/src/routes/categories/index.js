const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  getCategories,
  getCategoryBySlug,
} = require("../../controllers/category.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Public category endpoints
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all active categories
 *     tags: [Categories]
 *     description: Returns a list of all active, non-deleted categories sorted by newest first. This endpoint is cached in Redis for 1 hour.
 *     responses:
 *       200:
 *         description: Get categories successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 */
router.get("/", asyncHandler(getCategories));

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Get category detail by slug
 *     tags: [Categories]
 *     description: Returns a single active, non-deleted category by its slug. Cached in Redis for 1 hour.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: ao-thun-nam
 *         description: The URL-friendly slug of the category
 *     responses:
 *       200:
 *         description: Get category successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryDetailResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug", asyncHandler(getCategoryBySlug));

module.exports = router;
