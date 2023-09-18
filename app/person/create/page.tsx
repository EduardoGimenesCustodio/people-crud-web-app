"use client";

import React from "react";
import { Button, DatePicker, DatePickerProps, Form, Input } from "antd";
import type { FormInstance } from "antd/es/form";
import axios from "axios";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const dateFormat = "DD/MM/YYYY";

const CreatePerson: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const onFinish = async (values: any) => {
    const requestBody = {
      ...values,
      data_nascimento: values.data_nascimento.toISOString().substring(0, 10),
      data_admissao: values.data_admissao.toISOString().substring(0, 10),
      funcao: values.funcao ? values.funcao : null,
    };

    const res = await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_HOST}person`,
      data: requestBody,
    });

    console.log(res.status);
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  return (
    <div>
      <h1>Cadastrar Pessoa</h1>

      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
          marginTop: "10%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="rg" label="RG" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="cpf" label="CPF" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="data_nascimento"
          label="Data de nascimento"
          rules={[{ required: true }]}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>

        <Form.Item
          name="data_admissao"
          label="Data de admissao"
          rules={[{ required: true }]}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>

        <Form.Item name="funcao" label="Função" rules={[{ required: false }]}>
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Cadastrar
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Limpar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePerson;
