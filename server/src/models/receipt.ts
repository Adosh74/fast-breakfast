import { Schema, model, Model, Document } from 'mongoose';
import { Order } from './order';
import { User, UserDoc } from './user';

interface ReceiptAttrs {
	name: string;
	day: string;
	ordersId: string[];
	total?: number;
	userTotals?: Array<{ userId: string; total: number }>;
}

interface ReceiptDoc extends Document {
	name: string;
	day: string;
	title: string;
	ordersId: UserDoc[];
	total: number;
	userTotals: Array<{ userId: string; total: number }>;
}

interface ReceiptModel extends Model<ReceiptDoc> {
	build(attrs: ReceiptAttrs): ReceiptDoc;
}

const ReceiptSchema = new Schema(
	{
		name: { type: String, required: true },
		day: { type: String, default: new Date().toISOString().slice(0, 10) },
		ordersId: [{ type: String, ref: 'Order' }],
		title: String,
		total: Number,
		userTotals: [
			{
				userId: { type: String, ref: 'User' },
				total: Number,
			},
		],
		createdAt: {
			type: Number,
			default: Math.floor(Date.now() / 1000),
		},
	},
	{
		toJSON: {
			transform: function (doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

ReceiptSchema.pre('save', async function (next) {
	const receipt = this as unknown as ReceiptDoc;

	this.title = receipt.name + ' ' + receipt.day.split('-').reverse().join('-');

	if (!receipt.isModified('ordersId') && receipt.total !== undefined) {
		return next();
	}

	try {
		const orders = await Order.find({ _id: { $in: receipt.ordersId } })
			.populate('items.itemId')
			.populate('userId');

		let total = 0;
		const userTotalMap = new Map<string, number>();

		for (const order of orders) {
			const orderTotal = order.items.reduce((sum, item) => {
				const itemDoc = item.itemId as any;
				return sum + itemDoc.price * item.quantity;
			}, 0);

			total += orderTotal;

			const userId = order.userId._id!.toString();
			const currentUserTotal = userTotalMap.get(userId) || 0;
			userTotalMap.set(userId, currentUserTotal + orderTotal);
		}

		receipt.userTotals = Array.from(userTotalMap).map(([userId, total]) => ({
			userId,
			total,
		}));

		receipt.total = total;
		next();
	} catch (err) {
		next(err as Error);
	}
});

ReceiptSchema.pre('find', function () {
	this.populate('ordersId');
	this.populate('userTotals.userId');
});

ReceiptSchema.statics.build = (attrs: ReceiptAttrs) => {
	return new Receipt(attrs);
};

const Receipt = model<ReceiptDoc, ReceiptModel>('Receipt', ReceiptSchema);

export { Receipt };
