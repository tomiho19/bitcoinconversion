import React, {useState, useCallback, useEffect} from 'react';
import {Modal, Statistic, Row, Col, Select, Alert, message} from "antd";
import {convert, getCurrencies} from '../../restClient';

const Option = Select.Option;
const styling = {margin: '0 0 20px 0', display: 'flex', justifyContent: 'center'};

function ExchangeMonitor(props) {
    const [userName] = useState(props.userName);
    useEffect(() => {
        setVisible(!!props.userName);
    }, [props.userName]);
    const [visible, setVisible] = useState(!!userName);
    const [sets, setSets] = useState({});
    const [currencies, setCurrencies] = useState([]);
    useEffect(() => {
        function loadCurrencies() {
            setLoading(true);
            getCurrencies().then(
                response => handleResponse(response, 'currencies'),
                error => handleError(error)
            );
        }
        if (currencies && !currencies.length && !loading) {
            loadCurrencies();
        }
    });
    const [converts, setConverts] = useState([]);
    const [loading, setLoading] = useState(false);

    function handleResponse(response, key) {
        switch (key) {
            case 'currencies':
                handleCurrenciesResponse(response);
                break;
            case 'convert':
                handleConvertResponse(response);
                break;
            default:
                return
        }
        if(userName){
            message.success('Data has been loaded');
        }
    }

    function handleError(error) {
        setLoading(false);
        message.error(error)
    }

    function handleConvertResponse(response) {
        setConverts([...converts.slice(), response]);
        setLoading(false);
    }
    
    function handleCurrenciesResponse(response) {
        setSets(response);
        setCurrencies([...response.local.symbols, ...response.crypto.symbols]);
        setLoading(false);
    }



    function handleOk() {
        message.success('Good bye');
        setVisible(false);
    }

    function handleCancel() {
        setVisible(false);
    }

    function handleChange(selectedCurrency) {
        setLoading(true);
        const set = sets.crypto.symbols.includes(selectedCurrency) ? 'crypto' : 'local';
        convert(selectedCurrency, set).then(
            response => handleResponse({price: response, name: selectedCurrency}, 'convert'),
            error => handleError(error)
        )
    }

    function getDescription(el) {
        return <Row gutter={16} key={el.name}>
            <Col span={12}>
                <Statistic title="BTC" value={1}/>
            </Col>
            <Col span={12}>
                {/*<Statistic title={el.name} value={el.value} precision={5}/>*/}
                <Statistic title={el.name} value={el.price}/>
            </Col>
        </Row>;
    }

    const handleClose = useCallback(el => {
        setConverts(converts.slice().filter(element => element.name !== el.name));
    }, [converts]);

    return (
        <Modal
            title={`Hello ${userName}, which currency you'd like to use to convert from today's Bitcoin value`}
            visible={visible}
            onOk={handleOk}
            confirmLoading={loading}
            onCancel={handleCancel}
        >
            <Row gutter={16} style={styling}>
                <Select
                    disabled={loading}
                    showSearch
                    style={{width: 200}}
                    placeholder="Select a currency"
                    optionFilterProp="children"
                    onChange={handleChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        currencies.map(currency => <Option key={currency} value={currency}>{currency}</Option>)
                    }
                </Select>
            </Row>

            {
                converts.map((el) => (
                    <Alert
                        closable
                        onClose={() => handleClose(el)}
                        key={el.name}
                        style={{margin: '15px 0'}}
                        type={'success'}
                        description={getDescription(el)}
                    />
                ))
            }
        </Modal>
    )
}

export default ExchangeMonitor;