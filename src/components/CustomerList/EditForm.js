import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, message, Select } from 'antd';

import { xUpdateCustomer } from '#api';
import { optimizeParam, provinces } from '#util';

const { Option } = Select;

class EditForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    editItemValue: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
  };

  submit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
    } = this.props;

    this.setState({
      loading: true,
    });

    validateFields((err, values) => {
      const { handleCancel, editItemValue } = this.props;
      if (!err) {
        xUpdateCustomer({
          params: {
            customerId: editItemValue.customerId,
            ...optimizeParam(values),
          },
          suc: data => {
            this.setState({
              loading: false,
            });
            message.success(data.msg);
            handleCancel();
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      editItemValue,
    } = this.props;

    const list = [
      {
        label: '姓名',
        name: 'name',
        required: true,
      },
      {
        label: '电话',
        name: 'phone',
        required: true,
      },
      {
        label: '省份',
        name: 'province',
        required: true,
      },
      {
        label: '详细地址',
        name: 'address',
        required: true,
      },
      {
        label: '邮箱',
        name: 'email',
        required: false,
      },
    ];

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };

    return (
      <Form layout='horizontal' {...formItemLayout} onSubmit={this.submit}>
        {list.map(v => {
          if (v.name === 'province') {
            return (
              <Form.Item label={v.label} key={v.name}>
                {getFieldDecorator(v.name, {
                  rules: [{ required: true, message: `请输入${v.label}` }],
                  initialValue: editItemValue[v.name],
                })(
                  <Select>
                    {provinces.map(v => (
                      <Option value={v.name} key={v.name}>
                        {v.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            );
          }
          return (
            <Form.Item label={v.label} key={v.name}>
              {getFieldDecorator(v.name, {
                rules: [{ required: v.required, message: `请输入${v.label}` }],
                initialValue: editItemValue[v.name],
              })(<Input autoComplete='off' />)}
            </Form.Item>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type='primary' htmlType='submit' loading={this.state.loading}>
            提交
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(EditForm);
