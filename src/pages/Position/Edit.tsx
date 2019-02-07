import { connect } from 'dva';
import router from 'umi/router';
import React, { Component } from 'react';
import commonStyles from '../common.less';
import SimpleForm from '@/components/SimpleForm';
import Exception404 from '@/pages/Exception/404';
import { PositionType, CellAction } from './consts';
import { formatStrOrNumQuery } from '@/utils/format';
import { Button, Col, message, Skeleton } from 'antd';
import { FetchFormPayload } from '@/services/position';
import { EditPositionPayload } from '@/services/position';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { ConnectProps, ConnectState, PositionState } from '@/models/connect';

export interface EditProps extends ConnectProps<{ type: PositionType }> {
  loading?: {
    editPosition?: boolean;
    fetchForm?: boolean;
  };
  position?: PositionState;
}

const backToList = () => router.push('list');
const buttonColProps = [
  {
    sm: { span: 24, offset: 0 },
    md: { span: 12, offset: 6 },
    style: { paddingLeft: '0.5%' },
  },
  {
    sm: { span: 24, offset: 0 },
    md: { span: 12, offset: 3 },
    style: { paddingLeft: '0.5%' },
  },
];

class Edit extends Component<EditProps> {
  /**
   * key of current position
   */
  private key: string | number = null;

  constructor(props: EditProps) {
    super(props);
    const {
      dispatch,
      location: { search },
      match: {
        params: { type },
      },
    } = props;
    if (!Object.values(PositionType).includes(type)) {
      message.error(formatMessage({ id: 'position.error.unknown.type' }));
    } else {
      this.key = formatStrOrNumQuery.parse(search).get('key');
      dispatch<FetchFormPayload>({
        type: 'position/fetchForm',
        payload: {
          body: {
            action: CellAction.Edit,
            key: this.key,
          },
          query: { type },
        },
      });
    }
  }

  renderOperationArea = (_: any, submitLoading: boolean) => {
    const {
      position: {
        form: { groupAmount },
      },
    } = this.props;
    return (
      <Col {...(groupAmount === 1 ? buttonColProps[0] : buttonColProps[1])}>
        <Button htmlType="submit" loading={submitLoading} type="primary">
          <FormattedMessage id="word.submit" />
        </Button>
        <Button onClick={backToList} style={{ marginLeft: 8 }}>
          <FormattedMessage id="word.back" />
        </Button>
      </Col>
    );
  };

  onSubmit = (fieldsValue: object) => {
    const {
      dispatch,
      match: {
        params: { type },
      },
    } = this.props;
    dispatch<EditPositionPayload>({
      type: 'position/editPosition',
      payload: {
        body: {
          ...fieldsValue,
          key: this.key,
        },
        query: { type },
      },
    });
  };

  render() {
    const {
      loading,
      match: {
        params: { type },
      },
      position: { form: editForm },
    } = this.props;
    if (!Object.values(PositionType).includes(type)) {
      return <Exception404 />;
    }
    return (
      <div className={commonStyles.contentBody}>
        <Skeleton active loading={loading.fetchForm} paragraph={{ rows: 7 }}>
          <SimpleForm
            colProps={editForm.colProps}
            formItemProps={editForm.formItemProps}
            formItems={editForm.formItems}
            groupAmount={editForm.groupAmount}
            initialFieldsValue={editForm.initialFieldsValue}
            onSubmit={this.onSubmit}
            renderOperationArea={this.renderOperationArea}
            rowProps={editForm.rowProps}
            submitLoading={loading.editPosition}
          />
        </Skeleton>
      </div>
    );
  }
}

export default connect(
  ({ loading, position }: ConnectState): EditProps => ({
    loading: {
      editPosition: loading.effects['position/editPosition'],
      fetchForm: loading.effects['position/fetchForm'],
    },
    position,
  }),
)(Edit);
