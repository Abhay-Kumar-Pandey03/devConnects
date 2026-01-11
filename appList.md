# devConnectss APIs

authRouter
- POST /signup
- POSt /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

Status: interested, ignored, accepted, ignored

connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed


