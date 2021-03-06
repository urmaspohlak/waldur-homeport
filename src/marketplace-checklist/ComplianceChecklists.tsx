import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import { useSelector } from 'react-redux';
import useAsync from 'react-use/lib/useAsync';

import { get } from '@waldur/core/api';
import { LoadingSpinner } from '@waldur/core/LoadingSpinner';
import { translate } from '@waldur/i18n';
import { getProject } from '@waldur/workspace/selectors';

import { ChartHeader } from './ChartHeader';
import { PieChart } from './PieChart';

interface Checklist {
  uuid: string;
  name: string;
  score: number;
  positive_count: number;
  negative_count: number;
  unknown_count: number;
}

const getChecklists = (projectId: string) =>
  get<Checklist[]>(`/projects/${projectId}/marketplace-checklists/`).then(
    (response) => response.data,
  );

const ProjectChecklist = ({ project }) => {
  const state = useAsync(() => getChecklists(project.uuid), [project]);

  if (state.loading) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return <h3>{translate('Unable to load checklists.')}</h3>;
  }

  if (!state.value) {
    return null;
  }

  return (
    <Row>
      {state.value.map((checklist) => (
        <Col key={checklist.uuid} md={3}>
          <ChartHeader label={`${checklist.score} %`} value={checklist.name} />
          <PieChart
            positive={checklist.positive_count}
            negative={checklist.negative_count}
            unknown={checklist.unknown_count}
          />
        </Col>
      ))}
    </Row>
  );
};

export const ComplianceChecklists = () => {
  const project = useSelector(getProject);
  if (!project) {
    return null;
  }
  return <ProjectChecklist project={project} />;
};
