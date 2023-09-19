"use client";

import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Breadcrumb,
  Popconfirm,
} from "antd";
import type { FormInstance } from "antd/es/form";
import axios from "axios";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { redirect, useParams } from "next/navigation";
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

  const deletePerson = async () => {
    await axios({
      method: "delete",
      url: `${process.env.NEXT_PUBLIC_API_HOST}/person/${id_pessoa}`,
    })
      .catch(() => {
        error();
      })
      .then(() => {
        success();
      });
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
    message.success("Pessoa excluída com sucesso");
  };

  const error = () => {
    message.error("Erro ao excluir pessoa");
  };

  const cancel = () => {
    message.info("Pessoa não excluída");
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
                <span>Consultar Pessoa</span>
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
        style={{
          maxWidth: 600,
          marginTop: "10%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        initialValues={initialValues}
      >
        <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="rg" label="RG" rules={[{ required: true }]}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="cpf" label="CPF" rules={[{ required: true }]}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          name="data_nascimento"
          label="Data de nascimento"
          rules={[{ required: true }]}
        >
          <DatePicker disabled={true} format={dateFormat} />
        </Form.Item>

        <Form.Item
          name="data_admissao"
          label="Data de admissao"
          rules={[{ required: true }]}
        >
          <DatePicker disabled={true} format={dateFormat} />
        </Form.Item>

        <Form.Item name="funcao" label="Função" rules={[{ required: false }]}>
          <Input disabled={true} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="button"
            href={`/person/update/${id_pessoa}`}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir pessoa"
            description="Tem certeza de que deseja excluir esta pessoa?"
            onConfirm={deletePerson}
            onCancel={cancel}
            okText="Sim"
            cancelText="Não"
          >
            <Button htmlType="button">Excluir</Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePerson;
