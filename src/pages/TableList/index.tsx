/* eslint-disable no-undef */
import { addRule, removeRule, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Image, Input, Select, Tag, Tooltip, message, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { ArticleService } from './service';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.ArticleList) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ArticleList[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  const { token } = theme.useToken();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ArticleList>();
  const [selectedRowsState, setSelectedRows] = useState<API.ArticleList[]>([]);
  const [tagList, setTagList] = useState<API.TagList[]>();

  const getTagList = async () => {
    try {
      const res = await ArticleService.getTagList();
      if (res.code === 200) {
        setTagList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTagList();
  }, []);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.ArticleList>[] = [
    {
      title: <FormattedMessage id="pages.articleTable.title" />,
      dataIndex: 'title',
      ellipsis: true,
      hideInSearch: true,
      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: <FormattedMessage id="pages.searchTable.content" />,
      dataIndex: 'content',
      ellipsis: true,
      hideInSearch: true,

      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: <FormattedMessage id="pages.searchTable.markdown" />,
      dataIndex: 'markdown',
      hideInSearch: true,
      ellipsis: true,
      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: <FormattedMessage id="pages.searchTable.tags" defaultMessage="Tags" />,
      dataIndex: 'tags',
      renderFormItem: () => {
        return (
          <Select
            showArrow
            mode="multiple"
            tagRender={({ label }) => <Tag color="blue">{label}</Tag>}
            options={tagList && tagList.map((x) => ({ label: x.name, value: x.id }))}
          />
        );
      },
      render: (text: any) =>
        text &&
        text.map((tag: any) => {
          return (
            <Tag key={tag.id} color="blue">
              {tag.name}
            </Tag>
          );
        }),
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.cover_image" defaultMessage="Last scheduled time" />
      ),
      dataIndex: 'cover_image',
      hideInSearch: true,
      ellipsis: true,
      render: (text: any) => text.cover_image && <Image src={text.cover_image} />,
    },
    {
      title: <FormattedMessage id="pages.searchTable.read_count" defaultMessage="read_count" />,
      dataIndex: 'read_count',
      hideInSearch: true,
      ellipsis: true,
      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.comment_count" defaultMessage="comment_count" />
      ),
      dataIndex: 'comment_count',
      hideInSearch: true,
      ellipsis: true,
      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: <FormattedMessage id="pages.searchTable.create_time" defaultMessage="Created time" />,
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </a>,
      ],
    },
  ];

  const getArticleList = async (params: API.PageParams) => {
    const { tags = '' } = params;

    try {
      const res = await ArticleService.getArticleList({ tags, ...params });
      return {
        data: res.data.data,
        total: res.data.total,
        success: true,
      };
    } catch (error) {
      console.log(error);
    }

    return {
      data: [],
      success: true,
      total: 0,
    };
  };

  return (
    <PageContainer>
      <ProTable<API.ArticleList, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getArticleList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.ArticleList);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.ArticleList>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.ArticleList>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
