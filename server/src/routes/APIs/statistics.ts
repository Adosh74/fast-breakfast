import { Router } from 'express';
import { currentUser } from '../../middlewares/current-user';
import { requireAuth } from '../../middlewares/require-auth';
import moment from 'moment';
import { Order } from '../../models/order';

const router = Router();

router.get('/', currentUser, requireAuth, async (req, res) => {
	const lastWeek = moment().subtract(7, 'days').toDate();
	const lastMonth = moment().subtract(30, 'days').toDate();

	// 1. Top Spending Users
	const topSpendingUsers = await Order.aggregate([
		{
			$match: {
				createdAt: { $gte: Math.floor(lastMonth.getTime() / 1000) },
			},
		},
		{
			$unwind: '$items',
		},
		{
			$lookup: {
				from: 'items',
				localField: 'items.itemId',
				foreignField: '_id',
				as: 'itemDetails',
			},
		},
		{
			$unwind: '$itemDetails',
		},
		{
			$group: {
				_id: '$userId',
				totalSpent: {
					$sum: { $multiply: ['$items.quantity', '$itemDetails.price'] },
				},
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: '_id',
				foreignField: '_id',
				as: 'user',
			},
		},
		{
			$unwind: '$user',
		},
		{
			$sort: { totalSpent: -1 },
		},
		{
			$limit: 5,
		},
		{
			$project: {
				_id: 0,
				userId: '$_id',
				name: '$user.name',
				email: '$user.email',
				totalSpent: 1,
			},
		},
	]);

	// 2. Most Purchased Items
	const mostPurchasedItems = await Order.aggregate([
		{
			$match: {
				createdAt: { $gte: Math.floor(lastMonth.getTime() / 1000) },
			},
		},
		{
			$unwind: '$items',
		},
		{
			$group: {
				_id: '$items.itemId',
				totalQuantity: { $sum: '$items.quantity' },
			},
		},
		{
			$lookup: {
				from: 'items',
				localField: '_id',
				foreignField: '_id',
				as: 'item',
			},
		},
		{
			$unwind: '$item',
		},
		{
			$sort: { totalQuantity: -1 },
		},
		{
			$limit: 5,
		},
		{
			$project: {
				_id: 0,
				itemId: '$_id',
				name: '$item.name',
				totalQuantity: 1,
			},
		},
	]);

	// 3. Revenue Trends (Last 7 Days)
	const revenueTrends = await Order.aggregate([
		{
			$match: {
				createdAt: {
					$gte: Math.floor(lastWeek.getTime() / 1000),
				},
			},
		},
		{
			$unwind: '$items',
		},
		{
			$lookup: {
				from: 'items',
				localField: 'items.itemId',
				foreignField: '_id',
				as: 'itemDetails',
			},
		},
		{
			$unwind: '$itemDetails',
		},
		{
			$addFields: {
				createdAtDate: { $toDate: { $multiply: ['$createdAt', 1000] } },
			},
		},
		{
			$group: {
				_id: {
					$dateToString: {
						format: '%Y-%m-%d',
						date: '$createdAtDate',
					},
				},
				totalRevenue: {
					$sum: { $multiply: ['$items.quantity', '$itemDetails.price'] },
				},
			},
		},
		{
			$sort: { _id: 1 },
		},
	]);

	// 4. User Activity Analysis
	const userActivity = await Order.aggregate([
		{
			$match: {
				createdAt: { $gte: Math.floor(lastMonth.getTime() / 1000) },
			},
		},
		{
			$group: {
				_id: '$userId',
				orderCount: { $sum: 1 },
				totalSpent: {
					$sum: {
						$reduce: {
							input: '$items',
							initialValue: 0,
							in: {
								$add: [
									'$$value',
									{
										$multiply: [
											'$$this.quantity',
											'$itemDetails.price',
										],
									},
								],
							},
						},
					},
				},
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: '_id',
				foreignField: '_id',
				as: 'user',
			},
		},
		{
			$unwind: '$user',
		},
		{
			$project: {
				_id: 0,
				userId: '$_id',
				name: '$user.name',
				email: '$user.email',
				orderCount: 1,
				totalSpent: 1,
			},
		},
	]);

	res.status(200).json({
		topSpendingUsers,
		mostPurchasedItems,
		revenueTrends,
		userActivity,
	});
});

export { router as statisticsRouter };
