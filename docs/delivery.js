/**
 * @swagger
 * /api/order/delivery/getAvailableOrders:
 *   get:
 *     summary: Get available orders for delivery
 *     description: Fetch all orders that are ready and not assigned to any delivery partner.
 *     tags:
 *       - Delivery
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available orders fetched successfully
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderNumber:
 *                         type: string
 *                         example: ORD1707139123AB
 *                       totalAmount:
 *                         type: number
 *                         example: 650
 *                       deliveryAddress:
 *                         type: string
 *                         example: "Sector 21, Chandigarh"
 *                       status:
 *                         type: string
 *                         example: ready
 *                       paymentMethod:
 *                         type: string
 *                         example: cash
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Aman Singh
 *                           phonenumber:
 *                             type: string
 *                             example: "9876543210"
 */
/**
 * @swagger
 * /api/order/delivery/assign/{orderId}:
 *   patch:
 *     summary: Assign an order to self
 *     description: Delivery partner assigns a ready order to themselves.
 *     tags:
 *       - Delivery
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: 64d1f9e1e8b1a2f123456789
 *     responses:
 *       200:
 *         description: Order assigned successfully
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
 *                   example: Order assigned successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderNumber:
 *                       type: string
 *                       example: ORD1707139123AB
 *                     status:
 *                       type: string
 *                       example: ready
 *                     assignedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid assignment state
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
/**
 * @swagger
 * /api/order/delivery/complete/{orderId}:
 *   patch:
 *     summary: Pick or complete delivery
 *     description: >
 *       If order is ready → marks as picked.
 *       If already picked/out_for_delivery → marks as delivered.
 *     tags:
 *       - Delivery
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Delivery status updated successfully
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
 *                   example: Order delivered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: delivered
 *                     pickedAt:
 *                       type: string
 *                       format: date-time
 *                     deliveredAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Not authorized for this order
 *       404:
 *         description: Order or tracking not found
 */
/**
 * @swagger
 * /api/order/delivery/getMyDeliveries:
 *   get:
 *     summary: Get delivery partner deliveries
 *     description: Fetch all deliveries assigned to the logged-in delivery partner.
 *     tags:
 *       - Delivery
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deliveryStatus
 *         schema:
 *           type: string
 *           example: delivered
 *         description: Filter by delivery status
 *     responses:
 *       200:
 *         description: Deliveries fetched successfully
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
 *                   example: 4
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderNumber:
 *                         type: string
 *                         example: ORD1707139123AB
 *                       finalAmount:
 *                         type: number
 *                         example: 480
 *                       deliveryAddress:
 *                         type: string
 *                         example: "Phase 7, Mohali"
 *                       status:
 *                         type: string
 *                         example: delivered
 *                       paymentMethod:
 *                         type: string
 *                         example: cash
 *                       pickedAt:
 *                         type: string
 *                         format: date-time
 *                       deliveredAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Kiran
 *                           phonenumber:
 *                             type: string
 *                             example: "9988776655"
 */

