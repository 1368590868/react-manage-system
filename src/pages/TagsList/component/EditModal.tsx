import { ArticleService, TagsService } from '@/pages/TableList/service';
import { ActionType } from '@ant-design/pro-components';
import { Modal, Form, Button, Input, message } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { SliderPicker } from 'react-color';

interface Props {
  ref: any;
  actionRef: { current: ActionType | undefined };
}

interface ColorPickerProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
}

export interface EditModalRef {
  // eslint-disable-next-line no-unused-vars
  showModal: (record: any) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [color, setColor] = useState('');

  React.useEffect(() => {
    setColor(value ?? 'red');
  }, []);

  const handleChange = (e: { hex: string }) => {
    setColor(e.hex);
    onChange?.(e.hex);
  };
  return <SliderPicker color={color} onChangeComplete={handleChange} />;
};

const EditModal: React.FC<Props> = React.forwardRef((props, ref) => {
  const { actionRef } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState({ id: '' });

  const showModal = (record: { id: string }) => {
    setRows(record);
    setVisible(true);
    form.setFieldsValue(record);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const doUpdate = async () => {
    try {
      const values = await form.validateFields();
      let res;
      if (!rows.id) {
        res = await TagsService.addTag(values);
      } else {
        res = await TagsService.updateTagById(rows.id, values);
      }

      if (res.code === 200) {
        message.success('修改成功');
        setVisible(false);
        actionRef.current?.reload(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal title="修改标签" open={visible} onOk={doUpdate} onCancel={() => setVisible(false)}>
      <Form form={form}>
        <Form.Item
          label="标签"
          name="name"
          rules={[
            {
              required: true,
              message: '填写 1 个标签',
            },
          ]}
        >
          <Input placeholder="填写 1 个标签" />
        </Form.Item>
        <Form.Item label="颜色" name="color">
          <ColorPicker />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default EditModal;
