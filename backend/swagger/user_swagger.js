/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all the users
 *     description: Returns a list of all users. Restricted to admin or super admin
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. User not authenticated
 *       403:
 *         description: Forbidden. User does not have admin or super admin privileges
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get the Current Authenticated User
 *     description: Returns the details of the currently logged-in user. Restricted to authenticated users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (User not authenticated)
 *       403:
 *         description: Forbidden. User does not have super admin or admin privileges
 *       500:
 *         description: Internal server error 
 */


/**
 * @swagger
 * /api/v1/users/me:
 *   delete:
 *     summary: Delete the current logged-in user
 *     description: Delete the current logged-in user. Restricted to authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the user account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User account deleted successfully
 *       401:
 *         description: Unauthorized. User not authenticated
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/v1/users/by-preferences:
 *   get:
 *     summary: Retrieve all users by preferences
 *     description: Retrieve all users that are close to the current logged user based on location and preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved nearby users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (User not authenticated)
 *       500:
 *         description: Internal server error 
 */



/**
 * @swagger
 * /api/v1/users/set-preference:
 *   put:
 *     summary: Set user preference
 *     description: Set preferences which will be used to filter users for matching. Restricted to authenticated user themselves
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 example: "Female"
 *               religion:
 *                 type: string
 *                 example: "Islam"
 *               ageRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     example: 20
 *                   max:
 *                     type: number
 *                     example: 30
 *               distance:
 *                 type: number
 *                 example: 50
 *               profession:
 *                 type: string
 *                 example: "Engineer"
 *             example:
 *               gender: "Female"
 *               religion: "Islam"
 *               ageRange:
 *                 min: 20
 *                 max: 30
 *               distance: 50
 *               profession: "Engineer"
 *     responses:
 *       200:
 *         description: Successfully set user preferences
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. User not authenticated
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/v1/users/update-preferences:
 *   patch:
 *     summary: Update user preferences
 *     description: Update user preferences for matching filters. Restricted to authenticated user themselves
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 description: Preferred gender for matching
 *                 example: "Female"
 *               religion:
 *                 type: string
 *                 description: Preferred religion for matching
 *                 example: "Christian"
 *               ageRange:
 *                 type: object
 *                 description: Preferred age range for matching
 *                 properties:
 *                   min:
 *                     type: number
 *                     description: Minimum preferred age
 *                     example: 25
 *                   max:
 *                     type: number
 *                     description: Maximum preferred age
 *                     example: 35
 *               distance:
 *                 type: number
 *                 description: Maximum distance preference in kilometers
 *                 example: 50
 *               profession:
 *                 type: string
 *                 description: Preferred profession for matching
 *                 example: "Doctor"
 *             example:
 *               gender: "Female"
 *               religion: "Christian"
 *               ageRange:
 *                 min: 25
 *                 max: 35
 *               distance: 50
 *               profession: "Doctor"
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Invalid preference data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid age range: min must be less than max"
 *       401:
 *         description: Unauthorized. User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */




/**
 * @swagger
 * /api/v1/users/profile-pictures:
 *   post:
 *     summary: Upload multiple profile pictures
 *     description: Upload multiple profile pictures for the current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files (JPEG, PNG, WEBP, JPG)
 *                 example: [image1.jpg, image2.png]
 *     responses:
 *       201:
 *         description: Pictures uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "3 image(s) uploaded successfully"
 *                 profilePictures:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/ProfilePicture"
 *       400:
 *         description: Bad request (no files or invalid files)
 *       413:
 *         description: Payload too large (file size or count exceeded)
 *       415:
 *         description: Unsupported media type (invalid file format)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/profile-pictures/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a profile picture
 *     description: Delete a specific profile picture by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the profile picture to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Picture deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Picture deleted successfully"
 *                 newPrimary:
 *                   $ref: '#/components/schemas/ProfilePicture'
 *                   nullable: true
 *       '404':
 *         description: Picture not found
 *       '500':
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/users/profile-pictures/{id}/primary:
 *   patch:
 *     summary: Set primary profile picture
 *     description: Mark a specific profile picture as the primary one
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the profile picture to set as primary
 *     responses:
 *       200:
 *         description: Primary picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Primary picture updated successfully
 *                 primaryPicture:
 *                   $ref: "#/components/schemas/ProfilePicture"
 *       404:
 *         description: Picture not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/profile-pictures:
 *   get:
 *     summary: Get current user's profile pictures
 *     description: Retrieve all profile pictures for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile pictures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ProfilePicture"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/{id}/profile-pictures:
 *   get:
 *     summary: Get user's profile pictures by user ID
 *     description: Retrieve all profile pictures for a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose pictures to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved profile pictures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ProfilePicture"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/users/block-user/{userId}:
 *   post:
 *    summary: To block a user
 *    tags: ["Users"]
 *    parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *         type: integer
 *         required: true
 *       description: The user id
 *    responses:
 *       200:
 *         description: The info of the blocking of the user
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/blockedUsers'
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/v1/users/unblock/{userId}:
 *   post:
 *    summary: To update user's block status
 *    tags: ["Users"]
 *    parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *         type: integer
 *         required: true
 *       description: The user id
 *    responses:
 *       200:
 *         description: The user has been unblocked or blocked
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/ActionUnblock'
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/v1/users/you-liked:
 *   get:
 *    summary: To get the list of users you have liked
 *    tags: ["Users"]
 *    responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LikesandDislikes'
 *       500:
 *         description: Server error
 */



/**
 * @swagger
 * /api/v1/users/you-disliked:
 *   get:
 *    summary: To get the list of users you have disliked
 *    tags: ["Users"]
 *    responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LikesandDislikes'
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/v1/users/liked-you:
 *   get:
 *    summary: To get the list of users that have liked you
 *    tags: ["Users"]
 *    responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array2
 *               items:
 *                 $ref: '#/components/schemas/LikesandDislikes'
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by Id
 *     description: Return the details of a user specified by their id. Restricted to authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user by Id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (User not authenticated)
 *       500:
 *         description: Internal server error                 
 */


/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update user data specified by the id. Restricted to authenticated user themselves, admin or super admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *             example:
 *               bio: "This is the updated bio"
 *     responses:
 *       200:
 *         description: Successfully updated user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. User not authenticated
 *       403:
 *         description: Forbidden. User does not have admin or super admin privileges
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * 
 *   schemas:
 *     ProfilePicture:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "405er333333434f"
 *         url:
 *           type: string
 *           example: "https://res.cloudinary.com/demo/image/upload/v1234567/profile.jpg"
 *         publicId:
 *           type: string
 *           example: "profile_xyz123"
 *         isPrimary:
 *           type: boolean
 *           example: true
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         metadata:
 *           type: object
 *           properties:
 *             width:
 *               type: number
 *               example: 800
 *             height:
 *               type: number
 *               example: 800
 *             format:
 *               type: string
 *               example: "jpg"
 *             bytes:
 *               type: number
 *               example: 123456
 *       required:
 *         - _id
 *         - url
 *         - publicId
 *         - isPrimary
 *         - uploadedAt
 * 
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         name:
 *           type: string
 *           description: User name
 *         phone:
 *           type: string
 *           description: User phone number
 *         gender:
 *           type: string
 *           enum: [male, female, others]
 *           description: User gender
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: User date of birth
 *         latitude:
 *           type: number
 *           description: User latitude location coordinate
 *         longitude:
 *           type: number
 *           description: User longitude location coordinate
 *         status:
 *           type: string
 *           enum: [active, inactive, blocked]
 *           description: User account status
 *         role:
 *           type: string
 *           enum: [user, admin, superAdmin]
 *           description: User role
 *         bio:
 *           type: string
 *           description: User bio
 *         occupation:
 *           type: string
 *           description: User occupation
 *         country:
 *           type: string
 *           description: User country
 *         degree:
 *           type: string
 *           description: User degree
 *         religion:
 *           type: string
 *           description: User religion
 *         marital_status:
 *           type: string
 *           description: User marital status
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *               default: Point
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *         subscription_id:
 *           type: string
 *           description: User subscription ID
 *         preferences:
 *           type: object
 *           properties:
 *             gender:
 *               type: string
 *             ageRange:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                 max:
 *                   type: number
 *             distance:
 *               type: number
 *             religion:
 *               type: string
 *             profession:
 *               type: string
 *       example:
 *         _id: 67be07eeb54ccfa49e8550b9
 *         name: John Doe
 *         email: john@example.com
 *         phone: "0332334433"
 *         gender: male
 *         date_of_birth: "2025-02-24"
 *         latitude: 40
 *         longitude: 23.2
 *         status: active
 *         role: user
 *         bio: The boy is good
 *         occupation: Engineer
 *         country: Nigeria
 *         degree: BSc
 *         religion: Islam
 *         marital_status: Single
 *         location:
 *           type: Point
 *           coordinates: [40, 23.2]
 *         subscription_id: 67be07eeb54ccfa49e8550b9
 *         preferences:
 *           gender: male
 *           ageRange:
 *             min: 20
 *             max: 30
 *           distance: 20
 *           religion: Islam
 *           profession: Engineer
 * 
 *     blockedUsers:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - blocked_by
 *         - reason
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the blockedUser entry in the table
 *         userId:
 *           type: integer
 *           description: The id of one of the blocked or to be blocked user 
 *         blocked_by:
 *           type: integer
 *           description: The id of the user that blocked the user
 *         reason:
 *           type: string
 *           format: date
 *           description: The reason for the blocking
 *         status:
 *           type: string
 *           format: date
 *           description: The status of the blocking which can either be Blocked or Unblocked
 *       example:
 *         id: d5fE_asz
 *         userId: 3
 *         blocked_by: 1
 *         reason: Catfishing
 *         status: Blocked
 *         
 *     ActionUnblock:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: The status of the blocked user. It can be either Blocked or Unblocked
 *       example:
 *         status: Unblocked
 * 
 *     LikesandDislikes:
 *       type: object
 *       required:
 *         - user1_id
 *         - user2_id
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the object on the likes and dislikes table
 *         user1_id:
 *           type: integer
 *           description: The id of of the current user 
 *         user2_id: 
 *           type: integer
 *           description: The id of the other user that is either liked or disliked
 *         status:
 *           type: string
 *           description: The status of the user which can either be like or dislike
 *       example:
 *         id: d5fE_asz
 *         user1_id: 3
 *         user2_id: 1
 *         status: "like"
 */
