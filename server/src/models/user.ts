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

export interface UserDoc extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	active: boolean;
	passwordChangedAt?: Date;
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
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		active: {
			type: Boolean,
			default: true,
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		hashedOtp: String,
		otpExpires: Date,
		otpTries: Number,
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

userSchema.index({ email: 1 }, { unique: true });

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
