import { useState } from 'react';
import {
  UserOutlined,
  VideoCameraOutlined,
  ProfileOutlined,
  AliyunOutlined 
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Route, Routes } from 'react-router';
import { Dashboard } from '..';
import { Attendence } from './Attencence';
import { useNavigate } from "react-router-dom";
import "./Root.scss"
import { Profile } from './Profile';
import { useSelector } from 'react-redux';
import { userDetailsSelector } from '../../store/userDetails/selector';

const { Header, Content, Sider } = Layout;


export const Root = () => {

  const navigate = useNavigate()
  const activeUser = useSelector(userDetailsSelector)

  const items = [
    {
      key: 'dashboard',
      icon: <UserOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/')
    },
   { ...(activeUser.role === 'teacher' ? {
      key: 'qrcode',
      icon: <VideoCameraOutlined />,
      label: 'QR Code',
      onClick: () => navigate('/qr-code')
    } : { hidden: true })},
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
  ].filter((item) => item.hidden === true ? false : true)

  console.log("Items", {items})

  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return <Layout hasSider>
    <Sider style={{
      overflow: 'auto',
      minHeight: '100vh',
    }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div style={{ display: 'flex', justifyContent:'center', alignItems: 'center', height: 50, width: '100%', color: "#ffffff" }} ><AliyunOutlined color={"#ffffff"} /></div>
      <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline" items={items} />
    </Sider>
    <Layout className="site-layout">
      <Content style={{ margin: '0 12px', width: "99% !important", 
    paddingLeft : "20px" , 
    paddingRight: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {activeUser.role === 'teacher' && <Route path="/qr-code" element={<Attendence />} /> }
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Content>
    </Layout>
  </Layout>
}