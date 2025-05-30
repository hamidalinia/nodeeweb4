import {lazy} from 'react';

import OrderDetails from '@/views/OrderDetails';

const Add = lazy(() => import('@/views/Add'));
const Admin = lazy(() => import('@/views/Admin'));
// const CreatePage = lazy(() => import( '@/views/CreatePage'));
// const Db = lazy(() => import( '@/views/Db'));
const Home = lazy(() => import('@/views/Home'));
// const HomeDb = lazy(() => import( '@/views/Home_db'));
const Course = lazy(() => import('@/views/Course'));
const CourseStudy = lazy(() => import('@/views/CourseStudy'));
const CourseStudyLesson = lazy(() => import('@/views/CourseStudyLesson'));
const Product = lazy(() => import('@/views/Product'));
const Test = lazy(() => import('@/views/Test'));
const Login = lazy(() => import('@/views/Login'));
const Contacts = lazy(() => import('@/views/Contacts'));
const User = lazy(() => import('@/views/User'));
const ForumPost = lazy(() => import('@/views/ForumPost'));
const GameRound = lazy(() => import('@/views/GameRound'));
const RoundLevelPage = lazy(() => import('@/views/GameRoundLevel'));
const Order = lazy(() => import('@/views/Order'));
const Chat = lazy(() => import('@/views/Chat'));
const Entities = lazy(() => import('@/views/Entities'));
const Page = lazy(() => import('@/views/Page'));
const Profile = lazy(() => import('@/views/Profile'));
const MyOrders = lazy(() => import('@/views/MyOrders'));
const Transaction = lazy(() => import('@/views/Transaction'));
const DynamicPage = lazy(() => import('@/views/DynamicPage'));
const Checkout = lazy(() => import('@/views/Checkout'));
const Post = lazy(() => import('@/views/Post'));
const TitlesPage = lazy(() => import('@/views/TitlesPage'));
const DefaultLayout = lazy(() => import('@/layouts/Default'));
const Nohf = lazy(() => import('@/layouts/Nohf'));
const ProductCategory = lazy(() => import('@/views/ProductCategory'));

const DefaultRoute = [
  {
    path: '/add/:_id',
    element: Add,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/post/:_id',
    element: Post,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/post/:_id/:slug',
    element: Post,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/course/study/:_id',
    element: CourseStudy,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/course/study/:_id/:_lesson',
    element: CourseStudyLesson,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/game/:gameId/round/:roundId',
    element: GameRound,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/game/:gameId/round/:roundId/level/:levelId',
    element: RoundLevelPage,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/page/:_id',
    element: Page,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/product-category/:_id',
    element: ProductCategory,
    layout: DefaultLayout,
    exact: true,
  },

  {
    path: '/test/:_id',
    element: Test,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/product/:_id/:_slug',
    element: Product,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/product/:_id',
    element: Product,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/course/:_id',
    element: Course,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/user/:_id',
    element: User,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/forum-post/:_id',
    element: ForumPost,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/p/:_id',
    element: Product,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/login',
    element: Login,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/transaction/:method',
    element: Transaction,
    layout: Transaction,
    exact: true,
  },
  {
    path: '/transaction',
    element: Transaction,
    layout: Transaction,
    exact: true,
  },
  {
    path: '/login/:_state',
    element: Login,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/checkout',
    element: Checkout,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/chat',
    element: Chat,
    layout: Nohf,
    exact: true,
  },
  {
    path: '/chat/:user_id',
    element: Chat,
    layout: Nohf,
    exact: true,
  },
  {
    path: '/contacts',
    element: Contacts,
    layout: Nohf,
    exact: true,
  },

  {
    path: '/profile',
    element: Profile,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/my-orders',
    layout: DefaultLayout,
    element: MyOrders,
  },
  {
    path: '/order-details/:_id',
    layout: DefaultLayout,
    element: OrderDetails,
  },
  {
    path: '/order/:_id',
    layout: DefaultLayout,
    element: Order,
  },
  {
    path: '/a/:_entity/:_id/:_slug',
    element: Entities,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/:_id',
    element: Page,
    layout: DefaultLayout,
    exact: true,
  },
  {
    path: '/title/:_id',
    element: TitlesPage,
    layout: DefaultLayout,
    exact: true,
  },
];

function findPosition(e) {
  const routes = DefaultRoute;
  let d = -1
  routes.forEach((l, j) => {
    if (l?.path == e?.path) {
      console.log("l?.path===>", l?.path, e?.path)
      d = j
    }
  });
  // console.log("findPosition===>",e?.path)
  return d;

}

export default function createRoutes(themeRoutes) {
  let routes = DefaultRoute;
  console.log("==> createRoutes()", routes)
  console.log("==> createRoutes(): themeRoutes", themeRoutes)
  let exclude = ['/transaction/:method','/transaction']

  themeRoutes.forEach((e, j) => {
    if (e.element === 'Admin') e.element = Admin;
    else if (e.element === 'Home') e.element = Home;
    else if (e.element === 'Checkout') e.element = Checkout;
    else if (e.element === 'DynamicPage') e.element = DynamicPage;

    if (e.layout === 'Nohf') e.layout = Nohf;
    else if (e.layout === 'Transaction') e.layout = Transaction;
    else if (e.layout === 'DefaultLayout') e.layout = DefaultLayout;
    let fp = findPosition(e);
    if (fp > -1) {
      if (!(exclude.indexOf(e?.path) > -1)) {
        console.log(fp, "update route", e?.path)

        routes[fp] = {
          layout: e?.layout,
          element: e?.element,
          elements: e?.elements,
          path: e?.path,
          exact: e?.exact,
          updated: 1
        }
      }
    } else if (e.layout && e.element && e.path) routes.push(e);
  });
  return routes;
}
