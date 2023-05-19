import React, { useState } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Breadcrumb, MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Route, Routes } from 'react-router';

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));


export const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
      } = theme.useToken();

    return <Layout hasSider>
     <Sider  style={{
          overflow: 'auto',
          minHeight: '100vh',
        }} collapsible  collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
    <Layout className="site-layout">
      <Header style={{ padding: 0, background: colorBgContainer }} />
      <Content style={{ margin: '0 12px' }}>
          <Routes>
          <Route path="/home" element={<div>Home</div>} />
        </Routes>
      </Content>
    </Layout>
  </Layout>
}