import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  EuiIcon,
  EuiInMemoryTable,
  EuiToolTip,
} from '@elastic/eui';

export class Table extends PureComponent {
  static propTypes = {
    indexPattern: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    editField: PropTypes.func.isRequired
  }

  renderBooleanTemplate(value) {
    return value ? <EuiIcon type="dot" color="secondary" /> : <span/>;
  }

  renderFieldName(name, isTimeField) {
    return (
      <span>
        {name}
        {isTimeField ? (
          <span>
            &nbsp;
            <EuiToolTip content="This field represents the time that events occurred.">
              <EuiIcon type="clock" color="primary" />
            </EuiToolTip>
          </span>
        ) : ''}
      </span>
    );
  }

  renderFieldType(type, isConflict) {
    return (
      <span>
        {type}
        {isConflict ? (
          <span>
            &nbsp;
            <EuiToolTip content="The type of this field changes across indices. It is unavailable for many analysis functions.">
              <EuiIcon type="alert" color="warning" />
            </EuiToolTip>
          </span>
        ) : ''}
      </span>
    );
  }

  render() {
    const { indexPattern, items, editField } = this.props;

    const pagination = {
      initialPageSize: 10,
      pageSizeOptions: [5, 10, 25, 50]
    };

    const columns = [
      {
        field: 'displayName',
        name: 'Name',
        dataType: 'string',
        sortable: true,
        render: (value) => {
          return this.renderFieldName(value, indexPattern.timeFieldName === value);
        },
        width: '38%',
        'data-test-subj': 'indexedFieldName',
      },
      {
        field: 'type',
        name: 'Type',
        dataType: 'string',
        sortable: true,
        render: (value) => {
          return this.renderFieldType(value, value === 'conflict');
        },
        'data-test-subj': 'indexedFieldType',
      },
      {
        field: 'format',
        name: 'Format',
        dataType: 'string',
        sortable: true,
      },
      {
        field: 'searchable',
        name: 'Searchable',
        description: `These fields can be used in the filter bar`,
        dataType: 'boolean',
        sortable: true,
        render: this.renderBooleanTemplate,
      },
      {
        field: 'aggregatable',
        name: 'Aggregatable',
        description: `These fields can be used in visualization aggregations`,
        dataType: 'boolean',
        sortable: true,
        render: this.renderBooleanTemplate,
      },
      {
        field: 'excluded',
        name: 'Excluded',
        description: `Fields that are excluded from _source when it is fetched`,
        dataType: 'boolean',
        sortable: true,
        render: this.renderBooleanTemplate,
      },
      {
        name: '',
        actions: [
          {
            name: 'Edit',
            description: 'Edit',
            icon: 'pencil',
            onClick: editField,
            type: 'icon',
          },
        ],
        width: '40px',
      }
    ];

    return (
      <EuiInMemoryTable
        items={items}
        columns={columns}
        pagination={pagination}
        sorting={true}
      />
    );
  }
}
