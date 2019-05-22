import React, { useState, useCallback } from 'react';
import {Modal, Input, Icon, Tooltip, message} from "antd";

function WelcomePage(props) {
    const userName = localStorage.getItem('userName');
    const [visible, setVisible] = useState(!userName);
    const [name, setName] = useState('');
    const clearSuffix = name ? <Icon key={'clearSuffix'} type="close-circle" onClick={clearName}/> : null;
    const infoSuffix = !name ? 
        <Tooltip key={'infoSuffix'} title="Enter your name please">
            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }}/>
        </Tooltip> 
        : null;
    const handleChange = useCallback(event => setName(event.target.value), []);
    
    function clearName() {
        setName('');
    }

    function handleOk() {
        if(name){
            props.handleSaveUserName(name);
            message.success('Thank you very much!');
            setVisible(false);
        } else {
            message.warning('Please enter your name, we dont know how to congratulate you without it')
        }
    }

    function handleCancel() {
        setVisible(false);
    }

    return (
        <Modal
            title="Hello, please enter your name to continue"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Input
                placeholder="your name"
                onChange={handleChange}
                value={name}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={[clearSuffix, infoSuffix]}
            />
        </Modal>
    )
}

export default WelcomePage;