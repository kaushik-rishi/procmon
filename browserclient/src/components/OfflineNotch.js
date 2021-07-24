import React from "react";

const OfflineNotch = () => {
    // positioned absolute to the parent card so it shows an offline notch on the left
    return (
        <div
            className="fs-1 fw-bold p-3 text-uppercase position-absolute"
            style={{
                zIndex: 2,
                color: "red",
                top: "50%",
                left: "0",
                border: "1px solid red",
                transform: "rotate(-90deg) translateY(-50%) translateX(20%) ",
            }}
        >
            Offline
        </div>
    );
};

export default OfflineNotch;
