import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
	name: string;
	email: string;
	password: string;
}

interface UserModel extends Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends Document {
	name: string;
	email: string;
	password: string;
}

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform: function (doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}

	done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };