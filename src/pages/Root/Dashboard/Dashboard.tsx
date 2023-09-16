import { Button, Card, Col, Modal, Progress, Row, Select, Statistic , Typography ,DatePicker } from "antd"
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import QRCodePlugin from "./QRCodePlugin";
import useQRCodeScanner from "./useQRCodeScanner";

import QRCode from "react-qr-code";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
const { RangePicker } = DatePicker;

import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { userDetailsSelector } from "../../../store/userDetails/selector";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import './Dashboard.scss';


const { Text } = Typography;

interface TableDataType {
    attendence_id: string;
    student_id: string;
    course_id: string;
    subject_id: string;
    classroom_id: string;
    date: string;
}

export const Dashboard = () => {

    // const {startQrCode ,  decodedQRData,
    //     stopQrCode} = useQRCodeScanner({qrcodeMountNodeID : "scanner", getQrBoxDimension: { width: 250, height: 250 }})


    const [data, setData] = useState<TableDataType[]>([]);
    const [loading, setLoading] = useState(true);
    const userDetails = useSelector(userDetailsSelector);

    const isTeacher = useMemo(() => userDetails.role === "teacher", [userDetails.role]);

    const columns: ColumnsType<TableDataType> = [
        // {
        //     title: 'Attendence ID',
        //     dataIndex: 'attendence_id',
        //     key: 'attendence_id',
        //     },
        // {
        // title: 'Student Name',
        // dataIndex: 'student_id',
        // key: 'student_id',
        // },
        // {
        //     title: 'Course Name',
        //     dataIndex: 'course_name',
        //     key: 'course_name',

        // },
        {
            title: 'Subject Name',
            dataIndex: 'subject_name',
            key: 'subject_name',
            sorter: (a, b) => a.subject_name - b.subject_name,
        },
        {
            title: 'Classroom Name',
            dataIndex: 'classroom_name',
            key: 'classroom_name',
            sorter: (a, b) => a.classroom_name - b.classroom_name,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            defaultSortOrder: 'descend',
            sorter: (a, b) => +new Date(a.date) - +new Date(b.date),
            key: 'date',
            render: (text: any) => <div>{new Date(text).toLocaleString()}</div>
        },
        {
            title: "Attended",
            dataIndex: "attended",
            key: "attended",
            render: (text: any) => <div>{text ? "Yes" : "No"}</div>,
            sorter: (a, b) => a.attended - b.attended,
        }
    ];


    const teacherColumn: ColumnsType<TableDataType> = [
        {
            title: 'Student Name',
            dataIndex: 'student_name',
            key: 'student_name',
            sorter: (a, b) => a.student_name - b.student_name,
        },
        {
            title: 'Course Name',
            dataIndex: 'course_name',
            key: 'course_name',
            sorter: (a, b) => a.course_name - b.course_name,
        },
        {
            title: 'Subject Name',
            dataIndex: 'subject_name',
            key: 'subject_name',
            sorter: (a, b) => a.subject_name - b.subject_name,
        },
        {
            title: 'Total lectures',
            dataIndex: 'total_lectures',
            key: 'total_lectures',
            sorter: (a, b) => a.total_lectures - b.total_lectures,
        },
        {
            title: 'Attended lectures',
            dataIndex: 'total_attended',
            key: 'total_attended',
            sorter: (a, b) => a.total_attended - b.total_attended,
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (text: any, record: any) => <div>{Math.round((record.total_attended * 100) / (record.total_lectures || 1))}%</div>
        },
    ];

    const [scheduleInformation, setScheduleInformation] = useState<any>({});

    const getQRInformation = useCallback(async () => {
        const resp = await axios.get(`http://0.0.0.0:8000/schedule/${userDetails.userId}`);

        setScheduleInformation(resp.data);
    }, [userDetails.userId])

    useEffect(() => {
        if (isTeacher) getQRInformation();
    }, [getQRInformation, isTeacher])


    const getStudentAttendence = useCallback(async () => {
        try {
            const response = await axios.get(`http://0.0.0.0:8000/attendence/student/${userDetails.userId}`);
            setData(response.data);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // const [qrData, setQrData] = useState("")
    // const getQrData = useCallback(async () => {
    //     try {
    //         const response = await axios.post(`http://0.0.0.0:8000/generateQR`, { course_id: "CSE-101", subject_id: "CSE-101", classroom_id: "CSE-101", date: "2021-09-01", duration: 30 });

    //         console.log(response)
    //         setQrData(response.data);
    //     } catch (error) {
    //         setLoading(false);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    const getSubjectAttendence = useCallback(async () => {
        try {
            const response = await axios.get(`http://0.0.0.0:8000/attendence/subject/${userDetails.userId}`);
            setData(response.data);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, []);



    useEffect(() => {
        if (userDetails.userId) {
            if (userDetails.role === "teacher") {
                getSubjectAttendence();
            }
            else if (userDetails.role === "student") {
                getStudentAttendence();
            }
        }
    }, [getStudentAttendence, userDetails.userId, userDetails.role, getSubjectAttendence]);

    const addAttendence = async (qrData: any) => {
        try {
            console.log(qrData)
            const response = await axios.post(`http://0.0.0.0:8000/attendence`, qrData);
            console.log(response)
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
            getStudentAttendence();
        }
    }


    const onNewScanResult = debounce((decodedText: any, decodedResult: any) => {
        // handle decoded results here
        console.log(`Scan result = ${decodedText}`, decodedResult);
        if (decodedText && decodedText.length > 0) {
            try {
                addAttendence({ ...JSON.parse(decodedText), student_id: userDetails.userId })
            } catch (e) {
                console.log(e)
            }

            cameraRef.current = null;
            setStartScanning(false)
        }

    }, 5000, { leading: true, trailing: false });

    const courseOptions = scheduleInformation?.courses?.map((course: any) => {
        return { label: course.course_name, value: course.course_id }
    })

    const subjectOptions = scheduleInformation?.subjects?.map((subject: any) => {
        return { label: subject.subject_name, value: subject.subject_id }
    })

    const cameraRef = useRef(null);

    const stopScanning = useCallback(() => {
        if (cameraRef.current) {
            try {
                cameraRef.current.stop();
            } catch (e) {
                console.log(e)
            }
            finally {
                cameraRef.current = null;
            }
        }
        cameraRef.current = null;
        setStartScanning(false)
    }, [cameraRef])

    const [startScanning, setStartScanning] = useState(false)


    const startQRScanning = useCallback(() => {
        showModal();
        setStartScanning(true)

        // This method will trigger user permissions
        Html5Qrcode.getCameras().then(devices => {
            /**
             * devices would be an array of objects of type:
             * { id: "id", label: "label" }
             */
            if (devices && devices.length) {
                console.log(devices)
                const cameraId = devices[0].id;
                const html5QrCode = new Html5Qrcode("camera");
                cameraRef.current = html5QrCode;

                html5QrCode.start(
                    cameraId,
                    {
                        fps: 10,    // Optional, frame per seconds for qr code scanning
                        qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
                    },
                    (decodedText, decodedResult) => {
                        // do something when code is read
                        console.log(decodedText)
                        console.log(`Scan result = ${decodedText}`, decodedResult);
                        if (decodedText && decodedText.length > 0) {
                            html5QrCode.stop()
                            try {
                                addAttendence({ ...JSON.parse(decodedText), student_id: userDetails.userId })
                            } catch (e) {
                                console.log(e)
                            }
                        handleOk();
                        }
                    },
                    (errorMessage) => {
                        // parse error, ignore it.
                        // html5QrCode.stop()
                    })
                    .catch((err) => {
                        // Start failed, handle it.
                        // html5QrCode.stop()
                    })


                // .. use this to start scanning.
            }
        }).catch(err => {
            // handle err
        });
    }, [])

    const [attendenceStats, setAttendenceStats] = useState<any>(null);
    const [teacherAttendenceStats, setTeacherAttendenceStats] = useState<any>(null);

    const getAttendenceStats = useCallback(async () => {
        try {
            const response = await axios.get(`http://0.0.0.0:8000/attendenceStats/${userDetails.userId}`);
            console.log(response)
            setAttendenceStats(response.data)
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, []);


    const getTeacherAttendenceStats = useCallback(async () => {
        try {
            const response = await axios.get(`http://0.0.0.0:8000/teacherAttendenceStats/${userDetails.userId}`);
            console.log(response)
            setTeacherAttendenceStats(response.data)
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userDetails.userId) {
            if (userDetails.role === "student") {
                getAttendenceStats();
            }else if (userDetails.role === "teacher") {
                getTeacherAttendenceStats();
            }
        }
    }, [getAttendenceStats, userDetails.userId, userDetails.role, getTeacherAttendenceStats]);

    const formatter = (value: number) => <CountUp end={value} separator="," suffix="%" />;



    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        stopScanning()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        stopScanning()
    };

    const [course, setCourse] = useState(null);
    const [subject, setSubject] = useState(null);
    const [dates, setDates] = useState<any>(null);

    const fetchSubjectAttendence = async () => {
        if (course === null || subject === null || dates === null) {
            alert("Please fill all the fields")
            return
        }
        try {
            const response = await axios.get(`http://0.0.0.0:8000/attendence/${subject}/${course}` , { params: { start_date: dates[0].toISOString(), end_date: dates[1].toISOString() } });
            console.log(response)
            setData(response.data)
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }


    return <div className="dashboard">
        <h1>Dashboard</h1>
       {attendenceStats && <div className="dashboard__stats"><Row gutter={16}>
    <Col span={6}>
      <Card bordered={false} >
      <Statistic title="Days present / Total lectures" value={attendenceStats.total_present} suffix={`/ ${attendenceStats.total_attendance}`} />
      
      </Card>
    </Col>
    <Col span={6}>
      <Card bordered={false}>
         <Text type="secondary" >Attendance percentage</Text>
         <Progress type="circle" percent={Math.round(attendenceStats.attendence_percentage)} size={53}/>
      </Card>
    </Col>
   
    <Col span={6}>
      <Card bordered={false}>
        <Statistic
          title="Total allocated subjects"
          value={attendenceStats.total_subjects}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card bordered={false}>
       {attendenceStats.subject_attendence_counts.map((subject:any) => {
        return  <div className="dashboard_subject_percentage">
            <span>{subject.subject_name}</span>
            <Progress percent={Math.round(subject.attendance_present * 100 / subject.attendance_total || 1 )} size="small" /></div>
       })}
      </Card>
    </Col>
  </Row></div>}
  {teacherAttendenceStats && <div className="dashboard__stats"><Row gutter={16}>
    <Col span={6}>
      <Card bordered={false} >
      <Statistic title="Total lectures" value={teacherAttendenceStats.total_lectures_taken} />
      
      </Card>
    </Col>
    <Col span={6}>
      <Card bordered={false}>
        <Statistic
          title="Total allocated subjects"
          value={teacherAttendenceStats.total_subjects}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card bordered={false}>
        <div className="dashboard__subject_percentage_card">
       {teacherAttendenceStats.subject_lecture_counts.map((subject:any) => {
        return  <div className="dashboard_subject_percentage">
            <Text type="secondary">{subject.subject_name}</Text>
            <Statistic
                value={subject.total_lectures}
            />
            </div>
       })}
       </div>
      </Card>
    </Col>
  </Row></div>}
        {!isTeacher && (startScanning ? <Button  danger onClick={stopScanning}>Stop scanning</Button> : <Button type="primary" onClick={startQRScanning}>Scan QR Code</Button>)}
        {!isTeacher && <div className="App">
            <div id="scanner" />
            {/* <QRCodePlugin
                fps={10}
                qrbox={{height: 250, width: 250}}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            /> */}
        </div>
        }
        {/* <Button onClick={addAttendence}>Add attencence</Button> */}
        {/* <div id="camera"></div> */}
        <div className="dashboard__attendence-title"><h2>Attendence List</h2></div>
        {/* <QRCode value={JSON.stringify(qrData)} /> */}
        {isTeacher && 
        <div className="dashboard__table-filter">
        <div className="login-page__select">
            <Select placeholder="Select Course" options={courseOptions} onChange={(value) => setCourse(value)} />
        </div>

        <div className="login-page__select">
            <Select placeholder="Select Subject" options={subjectOptions} onChange={(value) => setSubject(value)} />
        </div>
        <RangePicker onChange={(value) => setDates(value) }/>
        <Button type="primary" onClick={fetchSubjectAttendence}>Fetch data</Button>
        </div> }
        
        {isTeacher ? <Table columns={teacherColumn} dataSource={data} /> : <Table columns={columns} dataSource={data} /> }

        <Modal title="Scan QR Code" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div id="camera"></div>
        </Modal>
    </div>
}
