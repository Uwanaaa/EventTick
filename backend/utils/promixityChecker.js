import { User } from "../models/user.js";

export const proximityChecker = async (distance, longitude, latitude) => {
    const users = await User.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                    },
                    $maxDistance: distance
                }
            }
    });
    return users
}