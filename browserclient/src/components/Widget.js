import React from "react";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";
import { Row, Col, Card } from "react-bootstrap";
import OfflineNotch from "./OfflineNotch";

const Widget = ({ data }) => {
    // console.log(data.macAddress);
    // console.log(data.isActive);
    // prettier-ignore
    const { cores, cpuLoad, cpuModel, cpuSpeed, freeMem, memUsage, osType, totalMem, uptime, usedMem, macAddress, isActive } = data;
    console.log(isActive);
    return (
        <Card
            className='m-5 p-3 rounded position-relative'
            style={{ position: "relative" }}>
            {!isActive && <OfflineNotch />}
            <Row>
                <Col>
                    <Cpu
                        info={cpuLoad}
                        macAddress={macAddress}
                        cpuWidgetId={`canvas-cpu-${macAddress}`}
                    />
                </Col>
                <Col>
                    <Mem
                        info={{
                            freeMem,
                            totalMem,
                            usedMem,
                            memUsage,
                        }}
                        macAddress={macAddress}
                        memWidgetId={`canvas-mem-${macAddress}`}
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
