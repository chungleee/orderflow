# Unmaintained and backend no longer works. Feel free to view the codebase though.

# OrderFlow
Role based restaurant application (not mobile friendly - yet)

## Description
This app has 3 roles, each role has their own internal app:
  - Admin: custom CMS to create/delete food items, restaurant staffs with roles and view orders.
  - Staff: this part is meant to mimic self-serve kiosks (think McDonalds); Customers can add food items to a cart and create an Food Order after successful payment through Stripe. Newly created Food Orders are sent to the Kitchen instantly
  - Kitchen: Receive Food Orders in real-time (thanks to Pusher). When Food Orders are completed, system sends a text message (thanks to Twilio) to notify the Customer that the order is ready for pick-up.
 
### Tech stack and third party APIs:
- React for visuals
- Redux for state management
- Mix of TachyonsCSS & EmotionCSS for styling and rapid development
- Formik & Yup for easy forms and form validations
- ExpressJS
- JWT for authentication and authorization
- MongoDB
- Multer, Sharp & ImageKit for file upload, image optimization and image cloud host CDN respectively
- Stripe to handle payments
- Twilio for SMS notifications
- Pusher for real-time data exchange
- Netlify & Google Cloud App Engine for production hosts
