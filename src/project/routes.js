import { withStore } from '@waldur/store/connect';

import { WOKSPACE_NAMES } from '../navigation/workspace/constants';

import { ProjectDashboardContainer } from './ProjectDashboardContainer';
import { ProjectEventsView } from './ProjectEventsList';
import { ProjectIssuesList } from './ProjectIssuesList';
import { ProjectTeam } from './team/ProjectTeam';

// @ngInject
function loadProject(
  $state,
  $stateParams,
  currentStateService,
  projectsService,
  projectPermissionsService,
  customersService,
  WorkspaceService,
  usersService,
) {
  if (!$stateParams.uuid) {
    return $state.go('errorPage.notFound');
  }

  async function loadData() {
    try {
      const user = await usersService.getCurrentUser();
      const project = await projectsService.$get($stateParams.uuid);
      const customer = await customersService.$get(project.customer_uuid);
      const permissions = await projectPermissionsService.getList({
        user: user.uuid,
        project: project.uuid,
      });
      project.permissions = permissions;
      currentStateService.setCustomer(customer);
      currentStateService.setProject(project);
      WorkspaceService.setWorkspace({
        customer,
        project,
        hasCustomer: true,
        workspace: WOKSPACE_NAMES.project,
      });
      const status = customersService.checkCustomerUser(customer, user);
      currentStateService.setOwnerOrStaff(status);
    } catch (response) {
      if (response.status === 404) {
        $state.go('errorPage.notFound');
      }
    }
  }
  return loadData();
}

// @ngInject
export default function projectRoutes($stateProvider) {
  $stateProvider
    .state('project', {
      url: '/projects/:uuid/',
      abstract: true,
      template: '<project-base></project-base>',
      data: {
        auth: true,
        workspace: 'project',
      },
      resolve: {
        project: loadProject,
      },
    })

    .state('project.details', {
      url: '',
      component: withStore(ProjectDashboardContainer),
      data: {
        pageTitle: gettext('Dashboard'),
        pageClass: 'gray-bg',
        hideBreadcrumbs: true,
      },
    })

    .state('project.issues', {
      url: 'issues/',
      component: withStore(ProjectIssuesList),
      data: {
        feature: 'support',
        pageTitle: gettext('Issues'),
        pageClass: 'gray-bg',
      },
    })

    .state('project.events', {
      url: 'events/',
      component: withStore(ProjectEventsView),
      data: {
        pageTitle: gettext('Audit logs'),
      },
    })

    .state('project.team', {
      url: 'team/',
      component: withStore(ProjectTeam),
      data: {
        pageTitle: gettext('Team'),
      },
    });
}
