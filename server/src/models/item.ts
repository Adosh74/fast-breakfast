import moment from 'moment';
import { Schema, model, Model, Document } from 'mongoose';

interface ItemAttrs {
	name: string;
	price: number;
	avatar?: string;
}

interface ItemModel extends Model<ItemDoc> {
	build(attrs: ItemAttrs): ItemDoc;
}

interface ItemDoc extends Document {
	name: string;
	price: number;
	avatar: string;
	createdAt: number;
}

const itemSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		avatar: {
			type: String,
			required: true,
			default:
				'https://i.pinimg.com/736x/53/3d/f3/533df3bc8e2a52135b632fa46316d3e7--middle-eastern-recipes-restaurant-recipes.jpg',
		},
		createdAt: {
			type: Number,
			default: () => moment.utc().unix(),
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

itemSchema.statics.build = (attrs: ItemAttrs) => {
	return new Item(attrs);
};

const Item = model<ItemDoc, ItemModel>('Item', itemSchema);

export { Item };
