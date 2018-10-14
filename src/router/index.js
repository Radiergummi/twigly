import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import FileSystemView from '@/components/views/FileSystemView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: HelloWorld,
      meta: {
        breadcrumb: 'Dashboard'
      }
    },
    {
      path: '/filesystem/:path(.*)?',
      name: 'FileSystem',
      component: FileSystemView,
      props: true,
      meta: {
        breadcrumb: 'Filesystem'
      }
    }
  ]
})
