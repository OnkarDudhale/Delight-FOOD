import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Username is required'], minlength: [4, 'Name must be at least 4 characters'], maxlength: 30, trim: true },
    email: { type: String, required: [true, 'Email address is required'], unique: true, trim: true },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cartData: { type: Object, default: {} },
    refreshToken: { type: String, default: null },
    profile_image: { type: String, default: null },
    publicImage_id: { type: String }
}, { minimize: false })

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;