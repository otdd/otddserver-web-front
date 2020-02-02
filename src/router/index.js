import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Otdd from '@/components/Otdd'
import Manage from '@/components/Manage'
import Module from '@/components/Module'
import NewModule from '@/components/NewModule'
import Task from '@/components/Task'
import TaskList from '@/components/TaskList'
import Edit from '@/components/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'Otdd',
      component: Otdd
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage
    },
    {
      path: '/otdd',
      name: 'Otdd',
      component: Otdd
    },
    {
      path: '/module/:id',
      name: 'Module',
      component: Module
    },
    {
      path: '/newmodule',
      name: 'NewModule',
      component: NewModule
    },
    {
      path: '/task/:id',
      name: 'Task',
      component: Task
    },
    {
      path: '/tasklist/:id',
      name: 'TaskList',
      component: TaskList
    },
    {
      path: '/edit/:id',
      name: 'Edit',
      component: Edit
    }
  ]
})
