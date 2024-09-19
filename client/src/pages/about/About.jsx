import React from 'react';
import { Layout, Card, Typography, Row, Col, Avatar, Divider } from 'antd';
import { UserOutlined, MobileOutlined, TabletOutlined, LaptopOutlined, EnvironmentOutlined, MailOutlined } from '@ant-design/icons';


const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const teamMembers = [
    {
        name: 'Salah HABYBY',
        role: 'Software Engineer',
        avatar: '/images/salah.jpg', // Chemin vers l'image de Salah
    },
    {
        name: 'Abdellah lyounsi',
        role: 'Software Engineer',
        avatar: '/images/abdellah.jpg', // Chemin vers l'image d'Abdellah
    },
    {
        name: 'Toufike labad',
        role: 'Software Engineer',
        avatar: '/images/toufike.jpg', // Chemin vers l'image de Toufike
    },
    {
        name: 'Moustapha',
        role: 'Software Engineer',
        avatar: '/images/moustapha.jpg', // Chemin vers l'image de Moustapha
    },
];

const About = () => {
    return (
        <Layout>
            <Content className="px-4 mt-5 py-10">
                <Card className="mb-8">
                    <Title level={2}>Qui sommes-nous ?</Title>
                    <Paragraph>
                        Nous sommes une entreprise spécialisée dans la réparation de dispositifs électroniques. Notre mission est de fournir des services de réparation de haute qualité pour une variété d'appareils électroniques, y compris les smartphones, les tablettes, les ordinateurs portables et bien plus encore. Avec des années d'expérience et une équipe de techniciens qualifiés, nous garantissons la satisfaction de nos clients.
                    </Paragraph>
                </Card>

                <Card className="mb-8">
                    <Title level={2}>Nos Services</Title>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Card className="text-center p-4">
                                <MobileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                <Title level={3}>Réparation de Smartphones</Title>
                                <Paragraph>
                                    Nous réparons tous les types de smartphones, y compris les écrans cassés, les problèmes de batterie, et plus encore.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card className="text-center p-4">
                                <TabletOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                <Title level={3}>Réparation de Tablettes</Title>
                                <Paragraph>
                                    Nos experts peuvent réparer les tablettes de toutes marques, résolvant les problèmes matériels et logiciels.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card className="text-center p-4">
                                <LaptopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                <Title level={3}>Réparation d'Ordinateurs</Title>
                                <Paragraph>
                                    Nous offrons des services de réparation complets pour les ordinateurs portables et de bureau, y compris les remplacements de pièces et les mises à jour système.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </Card>

                <Card className="mb-8">
                    <Title level={2}>Notre Équipe</Title>
                    <Row gutter={[16, 16]}>
                        {teamMembers.map((member, index) => (
                            <Col key={index} xs={24} sm={12} md={6} className="mb-4">
                                <Card>
                                    <Avatar size={64} src={member.avatar} icon={<UserOutlined />} />
                                    <Title level={4} className="mt-2">{member.name}</Title>
                                    <Paragraph>{member.role}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>

                <Card>
                    <Title level={2}>Merci de choisir Fixify !</Title>
                    <Paragraph>
                        Nous apprécions votre confiance en notre service. Chez Fixify, nous nous engageons à fournir des solutions de réparation fiables et rapides pour tous vos appareils électroniques. N'hésitez pas à nous contacter pour toute demande ou question. Votre satisfaction est notre priorité absolue.
                    </Paragraph>
                </Card>
            </Content>
            <footer class="bg-gray-50">
                    <div class="mx-auto grid max-w-screen-xl gap-y-8 gap-x-12 px-10 py-10 md:grid-cols-2 xl:grid-cols-4 xl:px-10">
                        <div class="max-w-sm">
                            <div class="mb-6 flex h-12 items-center space-x-2">
                                <span class="text-2xl font-bold">Fixi<span class="text-blue-600">Fy</span>.</span>
                            </div>
                            <div class="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis ad a officia ea expedita!</div>
                        </div>
                        <div class="">
                            <div class="mt-4 mb-2 font-medium xl:mb-4">Address</div>
                            <div class="text-gray-500">
                                35 Remida Heights, <br />
                                45 Street, <br />
                                South Caroline, US
                            </div>
                        </div>
                        <div class="">
                            <div class="mt-4 mb-2 font-medium xl:mb-4">Links</div>
                            <div aria-label="Footer Navigation" class="text-gray-500">
                                <ul class="space-y-3 pl-0">
                                    <li><a class="hover:text-blue-600 hover:underline" href="#">Pricing</a></li>
                                    <li><a class="hover:text-blue-600 hover:underline" href="#">Demo</a></li>
                                    <li><a class="hover:text-blue-600 hover:underline" href="#">Press</a></li>
                                    <li><a class="hover:text-blue-600 hover:underline" href="#">Support Hub</a></li>
                                    <li><a class="hover:text-blue-600 hover:underline" href="#">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="">
                            <div class="mt-4 mb-2 font-medium xl:mb-4">Subscribe to our Newsletter</div>
                            <div class="flex flex-col">
                                <div class="mb-4">
                                    <input type="email" class="focus:outline mb-2 block h-14 w-full rounded-xl bg-gray-200 px-4  focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="Enter your email" />
                                    <button class="block rounded-md bg-blue-600 px-4 py-2 font-medium text-white">Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-100">
                        <div class="mx-auto flex max-w-screen-xl flex-col gap-y-4 px-4 py-3 text-center text-gray-500 sm:flex-row sm:justify-between sm:text-left">
                            <div class="">© 2024 FixiFy | All Rights Reserved</div>
                            <div class="">
                                <a class="" href="#">Privacy Policy</a>
                                <span>|</span>
                                <a class="" href="#">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
        </Layout>
    );
};

export default About;
