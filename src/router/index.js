import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import FileSystemView from '@/components/views/FileSystemView'
import SettingsView from '@/components/views/SettingsView'
import EditorView from '@/components/views/EditorView'

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
    },
    {
      path: '/editor/:file(.*)?',
      name: 'Editor',
      component: EditorView,
      props: true,
      meta: {
        breadcrumb: 'Editor'
      }
    },
    {
      path: '/settings/:page?',
      name: 'Settings',
      component: SettingsView,
      meta: {
        breadcrumb: 'Settings'
      }
    }
  ]
})
