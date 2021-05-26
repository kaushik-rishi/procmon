import React from "react";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";
import { Row, Col, Card } from "react-bootstrap";

const Widget = ({ data }) => {
    // console.log(data.macAddress);
    // prettier-ignore
    const { cores, cpuLoad, cpuModel, cpuSpeed, freeMem, memUsage, osType, totalMem, uptime, usedMem } = data;
    return (
        <Card className='m-5 p-3 rounded'>
            <Row>
                <Col>
                    <Cpu info={cpuLoad} macAddress={data.macAddress} />
                </Col>
                <Col>
                    <Mem
                        info={{
                            freeMem,
                            totalMem,
                            usedMem,
                            memUsage,
                        }}
                        macAddress={data.macAddress}
                    />
                </Col>
                <Col>
                    <Info
                        info={{
                            cores,
                            cpuModel,
                            cpuSpeed,
                            osType,
                            uptime,
                        }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default Widget;
