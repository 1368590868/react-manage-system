import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '木木的后台管理系统',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'taric blog',
          title: 'Taric Blog',
          href: 'https://react.irlin.cn',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/1368590868/react-manage-system',
          blankTarget: true,
        },
        {
          key: 'nuxt',
          title: '木木小站',
          href: 'https://irlin.cn',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
