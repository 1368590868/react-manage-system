/* eslint-disable no-undef */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { theme, Tooltip, Button, message, Tag } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { ArticleService, TagsService } from '../TableList/service';
import EditModal, { EditModalRef } from './component/EditModal';

const TagsList: React.FC = () => {
  const { token } = theme.useToken();

  const actionRef = useRef<ActionType>();
  const [tagList, setTagList] = useState<API.TagList[]>();

  const modalRef = useRef<EditModalRef | null>(null);

  const getTagList = async () => {
    try {
      const res = await TagsService.getTagList();
      if (res.code === 200) {
        setTagList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const res = await TagsService.deleteTagById(id);
      if (res.code === 200) {
        message.success('删除成功');
        actionRef.current?.reload();
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

  const columns: ProColumns<API.TagList>[] = [
    {
      title: 'id' ?? <FormattedMessage id="pages.searchTable.content" />,
      dataIndex: 'id',
      ellipsis: true,
      hideInSearch: true,

      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: 'name' ?? <FormattedMessage id="pages.articleTable.title" />,
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: true,
      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: 'color' ?? <FormattedMessage id="pages.articleTable.title" />,
      dataIndex: 'color',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => <Tag color={record.color}>{record.color}</Tag>,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          key="edit"
          onClick={() => {
            modalRef.current?.showModal(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </Button>,
        <Button type="link" key="delete" danger onClick={() => deleteTag(record.id)}>
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete" />
        </Button>,
      ],
    },
  ];

  const getTagsList = async () => {
    try {
      const res = await TagsService.getTagList();
      return {
        data: res.data,
        total: res.data.length,
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
              modalRef.current?.showModal({ name: '' });
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getTagsList}
        columns={columns}
      />

      <EditModal ref={modalRef} actionRef={actionRef}></EditModal>
    </PageContainer>
  );
};

export default TagsList;
