import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import MultiPicUploader from '../../components/MultiPicUploader';
import MdEditor from '../../components/MdEditor';

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

  const doSubmit = async (values) => {
    console.log(values);
  };
  return (
    <PageContainer>
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
          <FormItem label="标题" name="title">
            <Input required />
          </FormItem>
          <FormItem label="内容" name="cotent">
            <TextArea rows={4} />
          </FormItem>
          <FormItem label="内容" name="markdown">
            <MdEditor />
          </FormItem>
          <FormItem label="图片" name="cover_image">
            <MultiPicUploader biz={'pic'} />
          </FormItem>
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <FormItem label="阅读数" name="read_count">
              <InputNumber defaultValue={1} />
            </FormItem>
            <FormItem label="标签" name="tags">
              <InputNumber defaultValue={1} />
            </FormItem>
            <Row gutter={24}>
              <Col span={16}>
                <Button
                  type="default"
                  onClick={async () => {}}
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
