import { Schema, model, Model, Document } from 'mongoose';

interface OrderAttrs {
	userId: string;
	items: { itemId: string; quantity: number }[];
}

interface OrderModel extends Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends Document {
	userId: string;
	items: { itemId: string; quantity: number }[];
	day: string;
}

const OrderSchema = new Schema(
	{
		userId: {
			type: String,
			ref: 'User',
			required: true,
		},
		items: [
			{
				itemId: {
					type: String,
					ref: 'Item',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		day: {
			type: String,
			default: new Date().toISOString().slice(0, 10),
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

OrderSchema.pre('find', function () {
	this.populate('items.itemId');
	this.populate('userId');
});

OrderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
