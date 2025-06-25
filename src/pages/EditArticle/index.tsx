/* eslint-disable no-undef */
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import MultiPicUploader from '../../components/MultiPicUploader';
import MdEditor from '../../components/MdEditor';
import { ArticleService, TagsService } from '../TableList/service';
import { useParams } from '@umijs/max';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
    md: {
      span: 3,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 19,
    },
    md: {
      span: 21,
    },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
      offset: 5,
    },
    md: {
      span: 8,
      offset: 3,
    },
  },
};

const EditArticle = () => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { id = '' } = useParams<{ id: string }>();
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

  const getArtcile = async () => {
    setLoading(true);
    try {
      if (id) {
        const res = await ArticleService.getArticleById(id);
        if (res.code === 200) {
          form.setFieldsValue(res.data);
          if (res.data?.tags) {
            const tagList = res.data.tags.map((item) => item.id);
            form.setFieldsValue({ tags: tagList });
          }
        }
      }
    } catch (e: any) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id !== 'add') getArtcile();

    getTagList();
  }, []);

  const doSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res =
        id !== 'add'
          ? await ArticleService.updateArticleById(id, values)
          : await ArticleService.saveArticle(values);
      if (res.code === 200) {
        message.success(id !== 'add' ? '更新成功' : '新增成功');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <PageContainer >
      <Card bordered={false} style={{ width: '100%' }}>
        <Form
          {...formItemLayout}
          form={form}
          name="post"
          labelAlign="left"
          requiredMark={false}
          scrollToFirstError
          onFinish={doSubmit}
        >
          <FormItem label="标题" name="title" rules={[{ required: true, message: '必填' }]}>
            <Input />
          </FormItem>
          <FormItem label="内容" name="content">
            <TextArea rows={4} />
          </FormItem>
          <FormItem label="文章内容" name="markdown" rules={[{ required: true, message: '必填' }]}>
            <MdEditor />
          </FormItem>
          <FormItem label="图片" name="cover_image">
            <MultiPicUploader />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <FormItem label="阅读数" name="read_count" initialValue={1}>
              <InputNumber />
            </FormItem>
            <FormItem label="标签" name="tags">
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Tags Mode"
                options={tagList && tagList.map((x) => ({ label: x.name, value: x.id }))}
              />
            </FormItem>
            <Row gutter={24}>
              <Col span={16}>
                <Button
                  type="primary"
                  style={{ width: 300 }}
                  onClick={doSubmit}
                  loading={loading}
                  disabled={loading}
                >
                  提交
                </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default EditArticle;
