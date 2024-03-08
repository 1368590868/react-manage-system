/* eslint-disable no-undef */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Image, Popconfirm, Select, Space, Tag, Tooltip, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ArticleService, TagsService } from './service';
import { history } from '@umijs/max';

const TableList: React.FC = () => {
  const { token } = theme.useToken();

  const actionRef = useRef<ActionType>();
  const [tagList, setTagList] = useState<API.TagList[]>();

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
      title: <FormattedMessage id="pages.articleTable.header" />,
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
      render: (text: any) => (
        <Space wrap>
          {text &&
            text.map((tag: any) => {
              return (
                <Tag key={tag.id} color={tag.color}>
                  {tag.name}
                </Tag>
              );
            })}
        </Space>
      ),
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.cover_image" defaultMessage="Last scheduled time" />
      ),
      dataIndex: 'cover_image',
      hideInSearch: true,
      ellipsis: true,
      render: (text: any, record: any) => record.cover_image && <Image src={record.cover_image} />,
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
      dataIndex: 'comments',
      hideInSearch: true,
      ellipsis: true,
      width: 100,
      align: 'center',
      render: (text) => <Tooltip>{text}</Tooltip>,
    },
    {
      title: <FormattedMessage id="pages.searchTable.create_time" defaultMessage="Created time" />,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      align: 'center',
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
            history.push(`/edit-article/${record.id}`);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </a>,
        <Popconfirm
          title="删除选项"
          description="确定删除吗?"
          onConfirm={async () => {
            try {
              const {
                data: { success },
              } = await ArticleService.deleteArticle(record.id);
              if (success) {
                actionRef.current?.reload();
              }
            } catch {}
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="text">
            <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete" />
          </Button>
        </Popconfirm>,
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
              history.push('/edit-article/add');
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.articleTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getArticleList}
        columns={columns}
        rowSelection={false}
      />
    </PageContainer>
  );
};

export default TableList;
