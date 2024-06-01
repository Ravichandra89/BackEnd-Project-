import mongoose, {Schema} from "mongoose";
import {User} from './user.model';

const subscriptionSchema = new Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // One who is Subscribing
        ref: 'User',
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        ref: "User",
    }
},{
    timestamps: true,
})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);