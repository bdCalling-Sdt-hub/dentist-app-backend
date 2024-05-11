import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.send('User get')
})

export const UserRoutes = router
