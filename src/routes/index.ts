import express from 'express'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import { BannerRoutes } from '../app/modules/banner/banner.route'
import { CategoryRoutes } from '../app/modules/category/category.route'
import { ContactRoutes } from '../app/modules/contact/contact.route'
import { OfferRoutes } from '../app/modules/offer/offer.route'
import { PackageRoutes } from '../app/modules/package/package.route'
import { RuleRoutes } from '../app/modules/rule/rule.route'
import { UserRoutes } from '../app/modules/user/user.route'
const router = express.Router()

const appRouteList = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/package',
    route: PackageRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/banner',
    route: BannerRoutes,
  },
  {
    path: '/rule',
    route: RuleRoutes,
  },
  {
    path: '/offer',
    route: OfferRoutes,
  },
]

appRouteList.forEach(route => router.use(route.path, route.route))

export default router
