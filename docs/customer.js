/**
 * @swagger
 * /api/menu/getMenu:
 *   get:
 *     summary: Get all available menu items
 *     description: >
 *       Fetch a paginated list of available and non-deleted menu items.
 *       Supports search, filtering, sorting, and price range.
 *     tags:
 *       - Menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search by name or category (case-insensitive)
 *       - in: query
 *         name: Category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isVegetarian
 *         schema:
 *           type: boolean
 *         description: Filter vegetarian items
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, price]
 *           default: name
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Menu items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 42
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     hasNextpage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevpage:
 *                       type: boolean
 *                       example: false
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64c8f2a9e8b1a2f123456789
 *                       name:
 *                         type: string
 *                         example: Veg Burger
 *                       price:
 *                         type: number
 *                         example: 120
 *                       Category:
 *                         type: string
 *                         example: Fast Food
 *                       isVegetarian:
 *                         type: boolean
 *                         example: true
 */
/**
 * @swagger
 * /api/menu/getSingleItem/{id}:
 *   get:
 *     summary: Get single available menu item
 *     description: Fetch a single menu item by ID that is available and not soft-deleted.
 *     tags:
 *       - Menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Menu item ID
 *         schema:
 *           type: string
 *           example: 64c8f2a9e8b1a2f123456789
 *     responses:
 *       200:
 *         description: Menu item fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c8f2a9e8b1a2f123456789
 *                     name:
 *                       type: string
 *                       example: Veg Burger
 *                     price:
 *                       type: number
 *                       example: 120
 *                     category:
 *                       type: string
 *                       example: Fast Food
 *       404:
 *         description: Menu item not found or soft-deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Not found or soft-deleted
 */
/**
 * @swagger
 * /api/order/createOrder:
 *   post:
 *     summary: Create a new order
 *     description: Create an order with menu items, delivery address, and payment details.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - deliveryAddress
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItemId
 *                     - quantity
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                       example: 64c8f2a9e8b1a2f123456789
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               deliveryAddress:
 *                 type: string
 *                 example: "221B Baker Street, Delhi"
 *               paymentMethod:
 *                 type: string
 *                 example: "COD"
 *               specialInstructions:
 *                 type: string
 *                 example: "Less spicy"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderNumber:
 *                       type: string
 *                       example: ORD1707139123AB
 *                     totalAmount:
 *                       type: number
 *                       example: 500
 *                     discountAmount:
 *                       type: number
 *                       example: 50
 *                     finalAmount:
 *                       type: number
 *                       example: 450
 *                     paymentMethod:
 *                       type: string
 *                       example: COD
 *                     status:
 *                       type: string
 *                       example: pending
 *                     preparationTimeFormatted:
 *                       type: string
 *                       example: "25 minutes"
 *                     estimatedDeliveryTimeIST:
 *                       type: string
 *                       example: "06/02/2026, 7:45 pm"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Menu item not available
 */
/**
 * @swagger
 * /api/order/getOwnOrder:
 *   get:
 *     summary: Get logged-in user's orders
 *     description: Fetch user's orders with filters, sorting, date range, and pagination.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: pending
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           example: pending
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-02-01
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-02-06
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 totalOrders:
 *                   type: integer
 *                   example: 8
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderNumber:
 *                         type: string
 *                         example: ORD1707139123AB
 *                       status:
 *                         type: string
 *                         example: pending
 *                       paymentStatus:
 *                         type: string
 *                         example: pending
 *                       finalAmount:
 *                         type: number
 *                         example: 450
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
/**
 * @swagger
 * /api/order/cancelledOrder/{id}:
 *   patch:
 *     summary: Cancel an order
 *     description: Cancel a pending or confirmed order with a cancellation reason.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           example: 64d1f9e1e8b1a2f123456789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancellationReason
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 example: Changed my mind
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: cancelled
 *                     cancellationReason:
 *                       type: string
 *                       example: Changed my mind
 *       400:
 *         description: Order cannot be cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
