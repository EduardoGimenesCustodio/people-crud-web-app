"use client";

import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Breadcrumb,
  Space,
} from "antd";
import type { FormInstance } from "antd/es/form";
import axios from "axios";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const dateFormat = "DD/MM/YYYY";
const databaseDateFormat = "YYYY-MM-DD";

const UpdatePerson: React.FC = () => {
  const params = useParams();
  const { id: id_pessoa } = params;

  const [form] = Form.useForm();

  const initialValues = {
    nome: undefined,
    rg: undefined,
    cpf: undefined,
    data_nascimento: undefined,
    data_admissao: undefined,
    funcao: undefined,
  };

  const formRef = React.useRef<FormInstance>(null);

  const onFinish = async (values: any) => {
    const requestBody = {
      ...values,
      data_nascimento: values.data_nascimento
        ? values.data_nascimento.toISOString().substring(0, 10)
        : undefined,
      data_admissao: values.data_admissao
        ? values.data_admissao.toISOString().substring(0, 10)
        : undefined,
      funcao: values.funcao ? values.funcao : undefined,
    };

    await axios({
      method: "put",
      url: `${process.env.NEXT_PUBLIC_API_HOST}/person/${id_pessoa}`,
      data: requestBody,
    })
      .then(() => {
        success();
      })
      .catch(() => {
        error();
      });
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_HOST}/person/${id_pessoa}`,
    })
      .then((res) => {
        form.setFieldsValue({
          ...res.data.pessoa,
          data_nascimento: res.data.pessoa.data_nascimento
            ? dayjs(res.data.pessoa.data_nascimento, databaseDateFormat)
            : undefined,
          data_admissao: res.data.pessoa.data_admissao
            ? dayjs(res.data.pessoa.data_admissao, databaseDateFormat)
            : undefined,
        });
      })
      .catch(() => {
        personNotFound();
      });
  }, [form, initialValues]);

  const success = () => {
    message.success("Pessoa atualizada com sucesso");
  };

  const error = () => {
    message.error("Erro ao atualizar pessoa");
  };

  const personNotFound = () => {
    message.error("Pessoa não encontrada");
  };

  return (
    <div>
      <Breadcrumb
        items={[
          {
            href: "/",
            title: <HomeOutlined />,
          },
          {
            href: "",
            title: (
              <>
                <UserOutlined />
                <span>Atualizar Pessoa</span>
              </>
            ),
          },
        ]}
      />

      <Form
        {...layout}
        form={form}
        ref={formRef}
        name="control-ref"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
          marginTop: "10%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        initialValues={initialValues}
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
          <Space size="middle">
            <Button type="primary" htmlType="submit">
              Atualizar
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Limpar
            </Button>
            <Button htmlType="button" href="/">
              Cancelar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePerson;
