import express from 'express'
import { UserRoutes } from '../app/modules/user/user.route'
const router = express.Router()

const appRouteList = [
  {
    path: '/user',
    route: UserRoutes,
  },
]

appRouteList.forEach(route => router.use(route.path, route.route))

export default router
