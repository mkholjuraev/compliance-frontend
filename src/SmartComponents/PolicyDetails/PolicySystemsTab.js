/* eslint-disable react/display-name */
import React from 'react';
import propTypes from 'prop-types';
import { NoSystemsTableWithWarning } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import EditSystemsButtonToolbarItem from './EditSystemsButtonToolbarItem';
import { apiInstance } from '../../Utilities/hooks/useQuery';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import { policySystemsMapper } from '../../constants';
import dataSerialiser from '../../Utilities/dataSerialiser';

const fetchApi = (offset, limit, fetchArguments) =>
  apiInstance
    .policySystems(
      fetchArguments.policyId,
      null,
      limit,
      offset,
      fetchArguments.sortBy,
      fetchArguments.filter
    )
    .then(({ data: { data = [], meta = {} } = {} } = {}) => ({
      data: dataSerialiser(data, policySystemsMapper),
      meta,
    }));

const PolicySystemsTab = ({ policy }) => {
  const apiV2Enabled = useAPIV2FeatureFlag();
  return (
    <SystemsTable
      columns={[
        Columns.customName(
          {
            showLink: true,
          },
          { sortBy: apiV2Enabled ? ['display_name'] : ['name'] }
        ),
        Columns.inventoryColumn('tags'),
        Columns.OS,
      ]}
      showOsMinorVersionFilter={[policy.osMajorVersion]}
      policyId={policy.id}
      policyRefId={policy.refId}
      showActions={false}
      remediationsEnabled={false}
      noSystemsTable={
        policy?.hosts?.length === 0 && <NoSystemsTableWithWarning />
      }
      complianceThreshold={policy.complianceThreshold}
      dedicatedAction={<EditSystemsButtonToolbarItem policy={policy} />}
      fetchApi={fetchApi}
      apiV2Enabled={apiV2Enabled}
    />
  );
};

PolicySystemsTab.propTypes = {
  policy: propTypes.shape({
    id: propTypes.string.isRequired,
    complianceThreshold: propTypes.string.isRequired,
    osMajorVersion: propTypes.string.isRequired,
    hosts: propTypes.array.isRequired,
    refId: propTypes.string.isRequired,
  }),
  dedicatedAction: propTypes.object,
  systemTableProps: propTypes.object,
};

export default PolicySystemsTab;
