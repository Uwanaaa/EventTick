            let nearByUser = await User.aggregate([
                {
                    $geoNear: {
                        near: targetLocation,
                        distanceField: "distance",
                        maxDistance: maxDistance,
                        spherical: true,
                        query: {
                            gender: req.user.preferences.gender,
                            age: { $gte: req.user.preferences.ageMin, $lte: req.user.preferences.ageMax },
                            religion: req.user.preferences.religion,
                            profession: req.user.preferences.profession,
                            _id: { $ne: req.user._id }
                        }
                    }
                }
            ]).skip(skip).limit(limit);

            let totalCount = nearByUser.length;
            let totalPages = Math.ceil(totalCount / limit);
            let hasNextPage = page < totalPages;


            if (nearByUser.length === 0) {
                nearByUser = await User.aggregate([
                    {
                        $geoNear: {
                            near: targetLocation,
                            distanceField: "distance",
                            maxDistance: distance * 1000,
                            spherical: true,
                            query: {
                                gender: req.user.gender === "male" ? "female" : "male",
                                _id: { $ne: req.user._id }
                            }
                        }
                    }
                ]).skip(skip).limit(limit);

                totalCount = nearByUser.length;
                totalPages = Math.ceil(totalCount / limit);
                hasNextPage = page < totalPages;

            }