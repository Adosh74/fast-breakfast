import { Schema, model, Model, Document } from 'mongoose';
import { UserDoc } from './user';
import moment from 'moment';

interface OrderAttrs {
	userId: string;
	items: { itemId: string; quantity: number }[];
}

interface OrderModel extends Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends Document {
	userId: UserDoc;
	items: { itemId: Schema.Types.ObjectId; quantity: number }[];
	day: string;
	received: boolean;
	createAt: Number;
}

const OrderSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: [
			{
				itemId: {
					type: Schema.Types.ObjectId,
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
			default: moment().format('YYYY-MM-DD'),
		},
		received: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Number,
			default: moment().unix(),
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

OrderSchema.index({ day: 1 });

OrderSchema.pre('find', function () {
	this.populate('items.itemId');
	this.populate('userId');
});

OrderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
