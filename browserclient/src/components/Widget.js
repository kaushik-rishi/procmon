import React from "react";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";
import { Row, Col, Card } from "react-bootstrap";
import OfflineNotch from "./OfflineNotch";
// import farmhash from "farmhash";

const Widget = ({ data }) => {
    // console.log(data.macAddress);
    // console.log(data.isActive);
    // prettier-ignore
    const { cores, cpuLoad, cpuModel, cpuSpeed, freeMem, memUsage, osType, totalMem, uptime, usedMem, macAddress, isActive } = data;

    let hashedMacAddress;
    hashedMacAddress = macAddress.replace(/:/g, "");
    // hashedMacAddress = farmhash.hash32(hashedMacAddress);
    // console.log(Object.keys(farmhash));
    return (
        <Card
            className="m-5 p-3 rounded position-relative"
            style={{ position: "relative" }}
        >
            {!isActive && <OfflineNotch />}
            <Row>
                <Col>
                    <Cpu
                        info={cpuLoad}
                        cpuWidgetId={`canvas-cpu-${hashedMacAddress}`}
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
                        memWidgetId={`canvas-mem-${hashedMacAddress}`}
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
