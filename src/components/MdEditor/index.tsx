import type { FC } from 'react';
import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import gfmLocale from '@bytemd/plugin-gfm/locales/zh_Hans.json';
import gemoji from '@bytemd/plugin-gemoji';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
import mathLocale from '@bytemd/plugin-math/locales/zh_Hans.json';
import mermaid from '@bytemd/plugin-mermaid';
import mermaidLocale from '@bytemd/plugin-mermaid/locales/zh_Hans.json';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import locale from 'bytemd/locales/zh_Hans.json';
import { message } from 'antd';
import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs.css';
import 'github-markdown-css/github-markdown-light.css';
import './index.less';
import { ArticleService } from '@/pages/TableList/service';

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}

const plugins = [
  gfm({
    locale: gfmLocale,
  }),
  gemoji(),
  highlight(),
  math({
    locale: mathLocale,
  }),
  mermaid({
    locale: mermaidLocale,
  }),
  mediumZoom(),
];

/**
 * Markdown 编辑器
 *
 * @author yupi
 */
const MdEditor: FC<Props> = (props) => {
  const { value = '', onChange, placeholder } = props;

  /**
   * 上传图片
   * @param file
   */
  const uploadPic = async (file: File) => {
    try {
      const res = await ArticleService.uploadImage(file);
      return res.data.url;
    } catch (e: any) {
      message.error('上传失败，' + e.message);
      return null;
    }
  };

  return (
    <div className="md-editor">
      <Editor
        value={value}
        placeholder={placeholder}
        mode="split"
        locale={locale}
        plugins={plugins}
        // @ts-ignore
        uploadImages={(files) => {
          return Promise.all(
            files.map(async (file) => {
              return {
                url: (await uploadPic(file)) ?? '',
                alt: file.name,
                title: file.name,
              };
            }),
          );
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default MdEditor;
