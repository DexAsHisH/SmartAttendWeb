import axios from "axios";
import { Field, Form, Formik } from "formik"
import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../../store/userDetails/selector";
import { useCallback, useEffect, useState } from "react";
import { set } from "lodash";
import QRCode from "react-qr-code";
import "./Attendence.scss"
import { Button, Modal, Space, Table } from "antd";
import FormItemLabel from "antd/es/form/FormItemLabel";

export const Attendence = () => {
    const userDetails = useSelector(userDetailsSelector);
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [showGenerateQRForm, setShowGenerateQRForm] = useState(false);

    const [qrData, setQrData] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
        setQrData(null)
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setShowGenerateQRForm(false);
        setQrData(null)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setShowGenerateQRForm(false);
        setQrData(null)
    };

    const getQRInformation = useCallback(async () => {
        const resp = await axios.get(`http://0.0.0.0:8000/schedule/${userDetails.userId}`);

        setData(resp.data);
    }, [userDetails.userId])

    useEffect(() => {
        getQRInformation();
    }, [getQRInformation])

    const getQrData = useCallback(async (data) => {
        try {
            const response = await axios.post(`http://0.0.0.0:8000/generateQR`, data);

            console.log(response)
            setQrData(response.data);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
            getQRInformation();
            getActiveQR();
        }
    }, []);

    const handleSubmit = (values: any) => {
        console.log(values)
        if (values.course_id === "" || values.subject_id === "" || values.classroom_id === "" || values.duration === null) {
            alert("Please fill all the fields")
            return
        }
        getQrData({ ...values, user_id: userDetails.userId, date: (new Date()).toISOString() })
    }

    const [activeQR, setActiveQR] = useState<any>(null);

    const getActiveQR = useCallback(async () => {
        try {
            const response = await axios.get(`http://0.0.0.0:8000/activeQR/${userDetails.userId}`);
            setActiveQR(response.data);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, [userDetails.userId]);

    useEffect(() => {
        getActiveQR();
    }, [getActiveQR])

    const columns = [
        {
            title: 'Course',
            dataIndex: 'course_name',
            key: 'course_name',
        },
        {
            title: 'Subject',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: 'Classroom',
            dataIndex: 'classroom_name',
            key: 'classroom_name',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text: any) => <div>{new Date(text).toLocaleString()}</div>
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (text: any) => <div>{text} mins</div>
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">

                    <Button onClick={() => {
                        setQrData(record);
                        setIsModalOpen(true);
                    }}>View</Button>
                    <Button onClick={() => {
                        axios.delete(`http://0.0.0.0:8000/deleteQR/${record.qr_id}`).then(() => {
                            getActiveQR();
                            getQRInformation();
                        }
                        )
                    }}>Delete</Button>
                </Space>
            ),
        }
    ];

    const [timeLeft, setTimeLeft] = useState<any>('');

    const calculateTimeLeft = useCallback((date: any, duration: any) => {
        const difference = +new Date(date) + duration * 60000 - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {

                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }else {
            handleCancel();
            getActiveQR();
            getQRInformation();
        }

        setTimeLeft(Object.values(timeLeft).map((v: any) => v < 10 ? "0" + v : v).join(":"));
    }, [getActiveQR, getQRInformation])



    useEffect(() => {
        if(qrData && (isModalOpen || showGenerateQRForm)){
        const timer = setInterval(() => {
            calculateTimeLeft(qrData.date, qrData.duration)
        }, 1000);
        return () => clearTimeout(timer);
    }
    }, [calculateTimeLeft, isModalOpen, qrData, showGenerateQRForm]);



    const [attendenceStats, setAttendenceStats] = useState<any>(null);



    const renderModal = () => {
       return qrData && <div className="attendence_qr">
            <div className="attendence__qr__info">
                <div>Course : <bold>{qrData.course_name}</bold></div>
                <div>Subject : <bold>{qrData.subject_name}</bold></div>
                <div>Classroom : <bold>{qrData.classroom_name}</bold></div>
            </div>
            <div className="attendence__qr__code">
            <QRCode value={JSON.stringify(qrData)} />
            </div>

            <div className="attendence__qr__timer">Time left : <bold>{timeLeft}</bold></div>                    
        </div>
    }

    return <div>
        <h1>Active QR codes</h1>
        <div className="attendence">
            <div className="attendence__generegate-qr-button"><Button type="primary" onClick={() => setShowGenerateQRForm(true)}>Generate new QR</Button></div>

            <Table columns={columns} dataSource={activeQR} />
            {/* { activeQR ? activeQR.map((qr : any) => {
                return <div className="attendence_qr"><QRCode value={JSON.stringify(qr)} /></div>

            }) : null} */}
        </div>

        <Modal title="Generate QR" open={showGenerateQRForm} onOk={handleOk} onCancel={handleCancel}>
            {qrData ? renderModal() : <div className="attendence">
                <Formik initialValues={{ course_id: '', subject_id: '', classroom_id: '', duration: null }} onSubmit={handleSubmit}>
                    <Form className="attendence__form">
                        <div className="attendence__select">
                            <Field name="course_id" as="select" placeholder="Select Course" >
                                {[<option key={"new"} value="" label="Select course" />, data?.courses ? data?.courses?.map((course: any) => {
                                    return <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
                                }) : []]}
                            </Field>
                        </div>
                        <div className="attendence__select" >
                            <Field name="subject_id" as="select" placeholder="Select Subject">
                                {[<option key={"new"} value="" label="Select subject" />, data?.subjects ? data?.subjects?.map((sub: any) => {
                                    return <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
                                }) : []]}
                            </Field>
                        </div>
                        <div className="attendence__select">
                            <Field name="classroom_id" as="select" placeholder="Select Classroom">
                                {[<option key={"new"} value="" label="Select classroom" />, data?.classrooms ? data?.classrooms?.map((classroom: any) => {
                                    return <option key={classroom.classroom_id} value={classroom.classroom_id}>{classroom.name}</option>
                                }) : []]}
                            </Field>
                        </div>
                        <div className="attendence__form-input">
                            <Field name="duration" type="number" placeholder="Duration in mins" />
                        </div>

                        <div className="attendence__form-button">
                            <button type="submit">Generate</button>
                        </div>
                    </Form>
                </Formik>

            </div>}
        </Modal>
        {<Modal title="Scan this QR code to mark your attendence" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>{ renderModal() }</Modal>}
      

    </div>
}
