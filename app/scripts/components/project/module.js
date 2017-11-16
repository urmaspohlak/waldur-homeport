import projectDetails from './project-details';
import projectDetailsButton from './project-details-button';
import projectCreate from './project-create';
import ProjectWorkspaceController from './project-workspace';
import projectPolicies from './project-policies';
import ProviderProjectsService from './project-providers-service';
import projectProviders from './project-providers';
import projectDialog from './project-dialog';
import projectIssues from './project-issues';
import projectEvents from './project-events';
import projectsList from './projects-list';
import projectAlertsList from './project-alerts-list';
import projectTeam from './project-team';
import projectsService from './projects-service';
import projectValidationService from './project-validation-service';
import projectRoutes from './routes';

export default module => {
  module.component('projectDetails', projectDetails);
  module.component('projectDetailsButton', projectDetailsButton);
  module.component('projectCreate', projectCreate);
  module.controller('ProjectWorkspaceController', ProjectWorkspaceController);
  module.component('projectPolicies', projectPolicies);
  module.service('ProviderProjectsService', ProviderProjectsService);
  module.component('projectProviders', projectProviders);
  module.component('projectDialog', projectDialog);
  module.component('projectIssues', projectIssues);
  module.component('projectEvents', projectEvents);
  module.component('projectsList', projectsList);
  module.component('projectAlertsList', projectAlertsList);
  module.component('projectTeam', projectTeam);
  module.service('projectsService', projectsService);
  module.service('projectValidationService', projectValidationService);
  module.config(projectRoutes);
};
