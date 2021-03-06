import Vue from 'vue'
import Router from 'vue-router'
import auth from './middleware/auth';

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: '/',
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [

        {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
            path: '',
            component: () => import('./layouts/main/Main.vue'),
            children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
              {
                path: '/',
                meta: {
                    middleware: auth,
                },
                component: () => import('./views/Home.vue')
              },
              {
                path: '/forensic_academy/courses',
                meta: {
                    middleware: auth,
                },
                component: () => import('./views/Home.vue')
              },
              {
                path: '/forensic_academy/faculty',
                meta: {
                    middleware: auth,
                },
                component: () => import('./views/Home.vue')
              },
              {
                path: '/forensic_academy/news',
                meta: {
                    middleware: auth,
                },
                component: () => import('./views/Home.vue')
              },,
              {
                path: '/my_data',
                meta: {
                    middleware: auth,
                },
                component: () => import('./views/my-data/MyData.vue')
              },
            ],
        },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
        {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
        // =============================================================================
        // PAGES
        // =============================================================================
              {
                path: '/login',
                name: 'login',
                meta: {},
                component: () => import('@/views/pages/Login.vue')
              },
              {
                path: '/register',
                name: 'register',
                meta: {},
                component: () => import('@/views/pages/Register.vue')
              },
              {
                path: '/error-404',
                name: 'error-404',
                meta: {},
                component: () => import('@/views/pages/Error404.vue')
              },
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/error-404'
        }
    ],
})

router.afterEach(() => {
  // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})
// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;
    return (...parameters) => {
        // Run the default Vue Router `next()` callback first.
        context.next(...parameters);
        // Than run the subsequent Middleware with a new
        // `nextMiddleware()` callback.
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}
router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];
        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);
        return middleware[0]({ ...context, next: nextMiddleware });
    }
    return next();
})

export default router
