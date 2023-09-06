import { ArticleService } from '@/pages/TableList/service';
import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es';
import React, { useState } from 'react';

interface Props {
  onChange?: (files: any) => void;
  value?: string;
}

const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function beforeUpload(file: File) {
  const isFileTypeValid =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/webp';
  if (!isFileTypeValid) {
    message.error('只能上传 JPG/PNG/SVG/WEBP 文件!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('图片大小不能超过 1MB!');
  }
  return isFileTypeValid && isLt1M;
}

/**
 * 多图上传
 * @param props
 * @constructor
 */
const MultiPicUploader: React.FC<Props> = (props) => {
  const { value = '', onChange } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    onChange?.(newFileList);
  };

  const doUpload = async (fileObj: any) => {
    try {
      const res = await ArticleService.uploadImage(fileObj.file);
      if (res.code === 200) {
        message.success('上传成功');
        onChange?.(res.data.url);
        setFileList([{ url: res.data.url, uid: '-1', name: '封面图', status: 'done' }]);
        setPreviewImage(res.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (value) {
      setPreviewImage(value);
      setFileList([{ url: value, uid: '-1', name: '封面图', status: 'done' }]);
    }
  }, [value]);

  const uploadButton =
    fileList.length > 0 ? (
      ''
    ) : (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );

  return (
    <>
      <Upload
        listType="picture-card"
        multiple
        maxCount={1}
        accept="image/jpeg,image/png,image/svg+xml,image/webp"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        customRequest={doUpload}
        onRemove={() => {
          // setFileList([]);
        }}
      >
        {uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default MultiPicUploader;
